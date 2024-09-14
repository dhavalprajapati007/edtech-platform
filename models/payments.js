const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    title: {
        type: Schema.Types.String,
        required: true,
    },
    description: {
        type: Schema.Types.String,
        default:""
    },
    mode: {
        type: Schema.Types.String,
        default:""
    },
    expiryDate: {
        type: Schema.Types.Date,
        default: null, // set a default value for the field
        required: true, // require a value for the field
    },
    actualPrice: {
        type: Schema.Types.String,
        default:"0"  
    },
    discount: {
        type: Schema.Types.Number,
        required: true,
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: "Department",
    },
    exam: {
        type: Schema.Types.ObjectId,
        ref: "Exam",
    },
},{ collection: 'payments' });

if(mongoose.models.Payments) {
    module.exports = mongoose.models.Payments;
} else {
    module.exports = mongoose.model('Payments', paymentSchema);
}