const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const discussionSchema = new Schema({
    text: {
        type: Schema.Types.String,
        required: true,
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
    questionId: {
        type: Schema.Types.ObjectId,
        ref: "Question"
    },
    upVotes: {
        type: Schema.Types.Number,
        default: 0
    },
    downVotes: {
        type: Schema.Types.Number,
        default: 0
    }
},{ collection: 'discussions', timestamps: true });

discussionSchema.pre("find", function () {
    // populate postedBy
    this.populate("postedBy");
});

if(mongoose.models.Discussion) {
    module.exports = mongoose.models.Discussion;
} else {
    module.exports = mongoose.model('Discussion', discussionSchema);
}