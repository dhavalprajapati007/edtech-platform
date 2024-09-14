const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forumSchema = new Schema({
    text: {
        type: Schema.Types.String,
        required: true,
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: "Department",
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: "Subject",
    },
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: "Student"
    },
    files: [{
        type: Schema.Types.String,
    }],
    recommended: {
        type: Schema.Types.Boolean,
        default: false
    },
    display: {
        type: Schema.Types.Boolean,
        default: true
    },
    upVotes: {
        type: Schema.Types.Number,
        default: 0
    },
    downVotes: {
        type: Schema.Types.Number,
        default: 0
    },
    answers: [{
        type: Schema.Types.ObjectId,
        ref: 'Answer',
    }]
},{ collection: 'forums', timestamps: true });

forumSchema.pre("find", function () {
    // populate answers and postedBy
    this.populate("answers").populate("postedBy").populate("subject");
});

forumSchema.pre("findOne", function () {
    // populate answers and postedBy
    this.populate({
        path: 'answers',
        populate: { path: 'postedBy' }
    }).populate("postedBy").populate('subject');
});

// forumSchema.pre('deleteOne', { document: true }, async function(doc, next) {
//     try {
//         const Answer = mongoose.model('Answer');
//         console.log(doc,'deletedDoc');

//         next();
//     } catch (error) {
//         next(error);
//     }
// });

if(mongoose.models.Forum) {
    module.exports = mongoose.models.Forum;
} else {
    module.exports = mongoose.model('Forum', forumSchema);
}