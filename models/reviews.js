const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
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
    },
    title: {
        type: Schema.Types.String,
        required: true,
    },
    reviews: [{
        username: {
            type: Schema.Types.String,
        },
        designation: {
            type: Schema.Types.String,
        },
        comment: {
            type: Schema.Types.String,
        },
        photo: {
            type: Schema.Types.String,
        },
        gender: {
            type: Schema.Types.String,
        },
    }]
},{ collection: 'reviews' });

if(mongoose.models.Reviews) {
    module.exports = mongoose.models.Reviews;
} else {
    module.exports = mongoose.model('Reviews', reviewSchema);
}