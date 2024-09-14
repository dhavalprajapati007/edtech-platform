const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const examAnalysisSchema = new Schema({
    display: {
        type: Schema.Types.Boolean,
        default: false,
    },
    publish: {
        type: Schema.Types.Boolean,
        default: false,
    },
    title: {
        type: Schema.Types.String,
        required: true,
    },
    description: {
        en: {
            type: Schema.Types.String,
            default:""
        },
        hn: {
            type: Schema.Types.String,
            default:""
        }
    },
    exam: {
        type: Schema.Types.ObjectId,
        ref: "Exam",
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: "Department",
    }
},{ collection: 'examanalyses', timestamps: true });

if(mongoose.models.ExamAnalysis) {
    module.exports = mongoose.models.ExamAnalysis;
} else {
    module.exports = mongoose.model('ExamAnalysis', examAnalysisSchema);
}