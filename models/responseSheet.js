const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const responseSheetSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Student",
    },
    referenceId: {
        type: Schema.Types.ObjectId
    },
    exam: {
        type: Schema.Types.ObjectId,
        ref: "Exam",
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: "Department",
    },
    title: {
        type: Schema.Types.String,
        required: true,
    },
    mode: {
        type: Schema.Types.String,
        required: true,
        enum: ["TestSeries", "PreviousYear"]
    },
    totalQuestions: {
        type: Schema.Types.Number,
        required: true,
    },
    duration: {
        type: Schema.Types.Number,
    },
    remainingTime: {
        type: Schema.Types.Number
    },
    sections: [{
        sectionId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        title: {
            type: Schema.Types.String,
            required: true
        },
        questions: [{
            questionId : {
                type: Schema.Types.ObjectId,
                ref: 'Question',
                required: true
            },
            answer: {
                type: Schema.Types.Mixed
            },
            result: {
                type: Schema.Types.Mixed
            },
            obtainedMarks: {
                type: Schema.Types.Number,
                required: true
            },
            status: {
                type: Schema.Types.String,
                required: true
            }
        }]
    }],
    unattempted : {
        type: Schema.Types.Number,
        required: true,
        default: 0
    },
    correctAns: {
        type: Schema.Types.Number,
        required: true,
        default: 0
    },
    wrongAns: {
        type: Schema.Types.Number,
        required: true,
        default: 0
    },
    positiveMarks: {
        type: Schema.Types.Number,
        required: true,
        default: 0
    },
    negativeMarks: {
        type: Schema.Types.Number,
        required: true,
        default: 0
    },
    finalMarks: {
        type: Schema.Types.Number,
        required: true,
        default: 0
    },
    noOfAttempts: {
        type: Schema.Types.Number,
        default: 0
    },
    totalMarks: {
        type: Schema.Types.Number
    }
},{ collection: 'responseSheet', timestamps: true });

if(mongoose.models.ResponseSheet) {
    module.exports = mongoose.models.ResponseSheet;
} else {
    module.exports = mongoose.model('ResponseSheet', responseSheetSchema);
}