import { validationMessageKey } from '../helpers/helper';
const Joi = require('joi');

export const submitTestResultValidation = async (req) => {

    const questionSchema = Joi.object({
        questionId: Joi.string().min(24).max(24).required(),
        answer: Joi.alternatives().try(Joi.array().items(Joi.string().min(24).max(24)), Joi.string().allow('')).required(),
        result: Joi.alternatives().try(Joi.boolean(), Joi.string().allow('')).required(),
        obtainedMarks: Joi.number().required(),
        status: Joi.string().valid('answered', 'marked', 'markedAndAnswered', 'notAnswered', 'notVisited').required()
    });
      
    const sectionSchema = Joi.object({
        sectionId: Joi.string().min(24).max(24).required(),
        title: Joi.string().required(),
        questions: Joi.array().items(questionSchema).required()
    });

    const schema = Joi.object({
        referenceId: Joi.string().min(24).max(24).required(),
        exam: Joi.string().min(24).max(24).required(),
        department: Joi.string().min(24).max(24).required(),
        title: Joi.string().required(),
        mode: Joi.string().required(),
        totalQuestions: Joi.number().required(),
        duration: Joi.number().required(),
        remainingTime: Joi.number().required(),
        sections: Joi.array().items(sectionSchema).required(),
        unattempted: Joi.number().required(),
        correctAns: Joi.number().required(),
        wrongAns: Joi.number().required(),
        positiveMarks: Joi.number().required(),
        negativeMarks: Joi.number().required(),
        finalMarks: Joi.number().required(),
        totalMarks: Joi.number().required()
    }).unknown(true);

    const { error } = schema.validate(req);

    if(error) {
        return validationMessageKey("validation", error);
    }

    return null;
}