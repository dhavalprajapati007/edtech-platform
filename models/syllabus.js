const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const syllabusSchema = new Schema({
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
},{ collection: 'syllabuses', timestamps: true });

if(mongoose.models.Syllabus) {
    module.exports = mongoose.models.Syllabus;
} else {
    module.exports = mongoose.model('Syllabus', syllabusSchema);
}