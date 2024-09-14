const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema

const testSeriesSchema = new Schema({
    name: {
        en: {
            type: Schema.Types.String,
            required: true,
            unique: true,
            default: "",
        },
    },
    display: {
        type: Schema.Types.Boolean,
        default: false,
    },
    time: {
        type: Schema.Types.Number,
        required: true,
    },
    mode: {
        type: Schema.Types.String,
        required: true,
    },
    marks: {
        type: Schema.Types.Number,
        required: true,
    },
    instructions: {
        en: { type: Schema.Types.String },
    },
    department: {
        type: Schema.Types.String,
        required: true,
    },
    exam: {
        type: Schema.Types.String,
        required: true,
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
    sections: [
        {
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
                }
            ],
        },
    ],
},{ collection: 'testseries' });

// Pre hooks

testSeriesSchema.pre("findOne", function () {
    // populate questions
    this.populate("sections.questions");
});

if(mongoose.models.TestSeries) {
    module.exports = mongoose.models.TestSeries;
}else {
    module.exports = mongoose.model('TestSeries', testSeriesSchema);
}