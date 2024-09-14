const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const yearCutOffSchema = new Schema({
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
},{ collection: 'yearcutoffs', timestamps: true });

if(mongoose.models.YearCutOff) {
    module.exports = mongoose.models.YearCutOff;
} else {
    module.exports = mongoose.model('YearCutOff', yearCutOffSchema);
}