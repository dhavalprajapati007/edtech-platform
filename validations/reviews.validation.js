import { validationMessageKey } from '../helpers/helper';
const Joi = require('joi');

export const getDepartmentWiseReviewsValidation = async (req) => {
    const schema = Joi.object({
        id: Joi.string().min(24).max(24).required()
    }).unknown(true);

    const { error } = schema.validate(req);

    if(error) {
        return validationMessageKey("validation", error);
    }

    return null;
}