const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const examSchema = new Schema({
    code: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    title: {
        type: Schema.Types.String,
        required: true,
    },
    display: {
        type: Schema.Types.Boolean,
        default: false,
    },
    departments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Department",
        },
    ]
},{ collection: 'exams' });

if(mongoose.models.Exam) {
    module.exports = mongoose.models.Exam;
} else {
    module.exports = mongoose.model('Exam', examSchema);
}