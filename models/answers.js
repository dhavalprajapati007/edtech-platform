const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answersSchema = new Schema({
    forum: {
        type: Schema.Types.ObjectId,
    },
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: "Student",
    },
    text: {
        type: Schema.Types.String,
        required: true,
    },
    files: [{
        type: Schema.Types.String,
    }],
    upVotes: {
        type: Schema.Types.Number,
        default: 0
    },
    display: {
        type: Schema.Types.Boolean,
        default: true
    },
    downVotes: {
        type: Schema.Types.Number,
        default: 0
    }
},{ collection: 'answers', timestamps: true });

answersSchema.post('save', async function(doc, next) {
    try {
        const Forum = mongoose.model('Forum');
        const forum = await Forum.findById(doc.forum);

        if(forum) {
            forum.answers.push(doc._id);
            await forum.save();
        }

        next();
    } catch (error) {
        next(error);
    }
});

if(mongoose.models.Answer) {
    module.exports = mongoose.models.Answer;
} else {
    module.exports = mongoose.model('Answer', answersSchema);
}