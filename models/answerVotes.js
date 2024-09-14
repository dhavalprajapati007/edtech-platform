const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answersVotesSchema = new Schema({
    answer: {
        type: Schema.Types.ObjectId,
        ref: "Answer",
    },
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: "Student",
    },
    direction: {
        type: Schema.Types.String,
        required: true,
    },
    vote: {
        type: Schema.Types.Number,
        default: 0
    }
},{ collection: 'answervotes', timestamps: true });


answersVotesSchema.post('save', async function(doc, next) {
  try {
    const Answer = mongoose.model('Answer');
    // const answer = await Answer.findById(doc.answer);
    if(doc.direction == 'upVote'){
      Answer.findByIdAndUpdate(doc.answer,{ $inc: { upVotes: doc.vote } }, { new: true }, (error, data) => {
        if(error) throw new Error(error);
        console.log(data,"updatedData");
      });
    }else{
      Answer.findByIdAndUpdate(doc.answer,{ $inc: { downVotes: doc.vote } }, { new : true }, (error, data) => {
        if(error) throw new Error(error);
        console.log(data,'updatedData');
      });
    }

    next();
  } catch (error) {
    next(error);
  }
});

if(mongoose.models.AnswerVotes) {
    module.exports = mongoose.models.AnswerVotes;
} else {
    module.exports = mongoose.model('AnswerVotes', answersVotesSchema);
}