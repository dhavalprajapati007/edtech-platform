const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookmarkSchema = new Schema({
    questions: [{
        question_id: {
            type: Schema.Types.ObjectId,
            ref: 'Question'
        },
        subjectId: {
            type: Schema.Types.ObjectId,
            ref: 'Subject'
        },
        type: {
            type: Schema.Types.String,
            required: true,
            enum: ["TestSeries", "PreviousPaper"]
        },
        test_series_id: {
            type: Schema.Types.ObjectId,
            ref: 'TestSeries',
            required: function () {
                return this.type === 'TestSeries';
            }
        },
        previous_paper_id: {
            type: Schema.Types.ObjectId,
            ref: 'PreviousPapers',
            required: function () {
                return this.type === 'PreviousPaper';
            }
        }
    }],
    postedBy: {
        type: Schema.Types.ObjectId,
    }
},{ collection: 'bookmarks', timestamps: true });

if(mongoose.models.Bookmark) {
    module.exports = mongoose.models.Bookmark;
} else {
    module.exports = mongoose.model('Bookmark', bookmarkSchema);
}