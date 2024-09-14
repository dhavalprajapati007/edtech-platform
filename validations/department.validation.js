import { validationMessageKey } from '../helpers/helper';
const Joi = require('joi');

export const saveDepartmentValidation = async (req) => {
    const schema = Joi.object({
        department: Joi.string().min(24).max(24).required(),
        exam: Joi.string().min(24).max(24).required()
    }).unknown(true);

    const { error } = schema.validate(req);

    if(error) {
        return validationMessageKey("validation", error);
    }

    return null;
}