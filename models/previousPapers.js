const mongoose = require('mongoose');

const { Schema } = mongoose;

const previousPapersSchema = Schema({
    name: {
        en: {
            type: Schema.Types.String,
            required: true,
            unique: true,
            default: "",
        },
        hn: {},
    },
    display: {
        type: Schema.Types.Boolean,
        default: false,
    },
    time: {
        type: Schema.Types.Number,
        required: true,
    },
    marks: {
        type: Schema.Types.Number,
        required: true,
    },
    instructions: {
        en: { type: Schema.Types.String, default: "" },
        hn: {},
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: "Department",
        required: true
    },
    exam: {
        type: Schema.Types.ObjectId,
        ref: "Exam",
        required: true
    },
    lock: {
        type: Schema.Types.Boolean,
        default: false,
    },
    publish: {
        type: Schema.Types.Boolean,
        default: false,
    },
    publishedBy: {
        type: Schema.Types.String,
    },
    postedBy: {
        type: Schema.Types.String,
        // required: true,
    },
    updatedBy: {
        type: Schema.Types.String,
    },
    sections: [{
        name: {
            type: Schema.Types.String,
        },
        compulsory: {
            type: Schema.Types.String,
        },
        tackle: {
            type: Schema.Types.Number,
        },
        questions: [
            {
                type: Schema.Types.ObjectId,
                ref: "Question",
            },
        ],
    }]
},{ collection: 'previousyears' });

// Pre hooks

previousPapersSchema.pre("findOne", function () {
    // populate questions
    this.populate("sections.questions");
});

if(mongoose.models.PreviousPapers) {
    module.exports = mongoose.models.PreviousPapers;
} else {
    module.exports = mongoose.model('PreviousPapers', previousPapersSchema);
}