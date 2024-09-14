const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
    code: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    title: {
        type: Schema.Types.String,
        required: true,
    },
    exams: [
        { 
            type: Schema.Types.ObjectId, 
            ref: "Exam" 
        }
    ],
    subjects: [
        {
            type: Schema.Types.ObjectId,
            ref: "Subject",
        },
    ],
},{ collection: 'departments' });

// Pre hooks

departmentSchema.pre("findOne", function () {
    // populate questions
    this.populate("subjects");
});

if(mongoose.models.Department) {
    module.exports = mongoose.models.Department;
} else {
    module.exports = mongoose.model('Department', departmentSchema);
}