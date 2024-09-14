import { validationMessageKey } from '../helpers/helper';
const Joi = require('joi');

export const getSingleFullLengthPaperValidation = async (req) => {
    const schema = Joi.object({
        id: Joi.string().min(24).max(24).required(),
        // limit : Joi.number().required(),
		// page : Joi.number().required(),
    }).unknown(true);

    const { error } = schema.validate(req);

    if(error) {
        return validationMessageKey("validation", error);
    }

    return null;
}


export const getSubjectWiseQuestionsValidation = async (req) => {
    const schema = Joi.object({
        id: Joi.string().min(24).max(24).required(),
        year: Joi.number().required(),
        // limit : Joi.number().required(),
		// page : Joi.number().required(),
    }).unknown(true);

    const { error } = schema.validate(req);

    if(error) {
        return validationMessageKey("validation", error);
    }

    return null;
}

export const getYearWiseSubjectQuestionsValidation = async (req) => {
    const schema = Joi.object({
        id: Joi.string().min(24).max(24).required()
    }).unknown(true);

    const { error } = schema.validate(req);

    if(error) {
        return validationMessageKey("validation", error);
    }

    return null;
}