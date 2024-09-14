const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forumVotesSchema = new Schema({
    forum: {
        type: Schema.Types.ObjectId,
        ref: "Forum",
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
},{ collection: 'forumvotes', timestamps: true });


forumVotesSchema.post('save', async function(doc, next) {
  try {
    const Forum = mongoose.model('Forum');
    // const answer = await Answer.findById(doc.answer);
    if(doc.direction == 'upVote'){
        Forum.findByIdAndUpdate(doc.forum,{ $inc: { upVotes: doc.vote } }, { new: true }, (error, data) => {
            if(error) throw new Error(error);
            console.log(data,"updatedData");
        });
    }else{
        Forum.findByIdAndUpdate(doc.forum,{ $inc: { downVotes: doc.vote } }, { new : true }, (error, data) => {
            if(error) throw new Error(error);
            console.log(data,'updatedData');
        });
    }

    next();
  } catch (error) {
    next(error);
  }
});

if(mongoose.models.ForumVotes) {
    module.exports = mongoose.models.ForumVotes;
} else {
    module.exports = mongoose.model('ForumVotes', forumVotesSchema);
}