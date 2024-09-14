const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const referenceEnumValues = {
    question: ['problem in question', 'problem in solution'],
    forum: ['inappropriate', 'unrelated'],
    comment: ['inappropriate', 'unrelated'],
    discussion: ['inappropriate', 'unrelated']
};

const reportSchema = new Schema({
    referenceId: {
        type: Schema.Types.ObjectId
    },
    postedBy: {
        type: Schema.Types.ObjectId,
    },
    // change it to reference
    reference: {
        type: Schema.Types.String,
        required: true,
        enum: ["forum", "question", "comment", 'discussion']
    },
    // add new field type
    type: {
        type: Schema.Types.String,
        required: false,
        validate: {
            validator: function(value) {
                const reference = this.reference;
                return referenceEnumValues[reference].includes(value);
            },
            message: 'Invalid comment value for the given reference'
        }
    },
    comment: {
        type: Schema.Types.String,
        required: true,
    },
    action: {
        type: Schema.Types.String,
        required: false,
    }
},{ collection: 'reports', timestamps: true });

if(mongoose.models.Report) {
    module.exports = mongoose.models.Report;
} else {
    module.exports = mongoose.model('Report', reportSchema);
}