const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const discussionVotesSchema = new Schema({
    discussionId: {
        type: Schema.Types.ObjectId,
        ref: "Discussion",
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
},{ collection: 'discussionvotes', timestamps: true });


discussionVotesSchema.post('save', async function(doc, next) {
    try {
        const Discussion = mongoose.model('Discussion');
        // const answer = await Answer.findById(doc.answer);
        if(doc.direction == 'upVote'){
            Discussion.findByIdAndUpdate(doc.discussionId,{ $inc: { upVotes: doc.vote } }, { new: true }, (error, data) => {
                if(error) throw new Error(error);
                console.log(data,"updatedData");
            });
        }else{
            Discussion.findByIdAndUpdate(doc.discussionId,{ $inc: { downVotes: doc.vote } }, { new : true }, (error, data) => {
                if(error) throw new Error(error);
                console.log(data,'updatedData');
            });
        }

        next();
    } catch (error) {
        next(error);
    }
});

if(mongoose.models.DiscussionVotes) {
    module.exports = mongoose.models.DiscussionVotes;
} else {
    module.exports = mongoose.model('DiscussionVotes', discussionVotesSchema);
}