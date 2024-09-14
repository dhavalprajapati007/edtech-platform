const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    username: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    password: {
        type: Schema.Types.String,
        required: true,
    },
    name: {
        type: Schema.Types.String,
        required: true,
    },
    phone: {
        type: Schema.Types.String,
    },
    resetPasswordCode: {
        type: Schema.Types.Number,
    },
    exam : {
        type: mongoose.Schema.Types.ObjectId
    },
    department : {
        type: mongoose.Schema.Types.ObjectId
    }

},{ collection: 'students' });

if(mongoose.models.Student) {
    module.exports = mongoose.models.Student;
} else {
    module.exports = mongoose.model('Student', studentSchema);
}