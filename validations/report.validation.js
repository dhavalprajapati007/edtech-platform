import { validationMessageKey } from '../helpers/helper';
const Joi = require('joi');

export const submitReportValidation = async (req) => {
    const schema = Joi.object({
        referenceId: Joi.string().min(24).max(24).required(),
        comment: Joi.string().required(),
        type: Joi.string().required()
    }).unknown(true);

    const { error } = schema.validate(req);

    if(error) {
        return validationMessageKey("validation", error);
    }

    return null;
}