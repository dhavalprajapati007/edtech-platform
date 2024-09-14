const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    code: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    title: {
        type: Schema.Types.String,
        required: true,
    },
    departments:[
        {
            type: Schema.Types.ObjectId,
            ref: "Department"
        }
    ],
    topics: [
        {
            type: Schema.Types.ObjectId,
            ref: "Topic",
        }
    ],
    chapters: [
        {
            type: Schema.Types.ObjectId,
            ref: "Chapter",
        }
    ],
    display: {
        type: Schema.Types.Boolean,
        required: true,
        default: false
    },
    lock: {
        type: Schema.Types.Boolean,
        required: true,
        default: true
    }
},{ collection: 'subjects' });

if(mongoose.models.Subject) {
    module.exports = mongoose.models.Subject;
} else {
    module.exports = mongoose.model('Subject', subjectSchema);
}