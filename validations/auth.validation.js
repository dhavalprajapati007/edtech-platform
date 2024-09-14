import { validationMessageKey } from '../helpers/helper';
const Joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const JoiPassword = Joi.extend(joiPasswordExtendCore);

export const signupUserValidation = async (req) => {
    const schema = Joi.object({
        fullName: Joi.string().required(),
        mobile: Joi.string().required().length(10).pattern(/^[0-9]+$/),
        email: Joi.string().required().email({ tlds: {allow: false} }),
        password: JoiPassword
            .string()
            .minOfSpecialCharacters(1)
            .minOfLowercase(2)
            .minOfUppercase(1)
            .minOfNumeric(2)
            .noWhiteSpaces()
            .required()
    }).unknown(true);
    const { error } = schema.validate(req);
    if(error) {
        return validationMessageKey("validation", error);
    }
    return null;
}

export const loginUserValidation = async (req) => {
    const schema = Joi.object({
        email: Joi.string().required().email({ tlds: {allow: false} }),
        password: JoiPassword
            .string()
            .minOfSpecialCharacters(1)
            .minOfLowercase(2)
            .minOfUppercase(1)
            .minOfNumeric(2)
            .noWhiteSpaces()
            .required()
    }).unknown(true);
    const { error } = schema.validate(req);
    if(error) {
        return validationMessageKey("validation", error);
    }
    return null;
}

export const forgotPasswordValidation = async (req) => {
    const schema = Joi.object({
        email: Joi.string().required().email({ tlds: {allow: false} })
    }).unknown(true);
    const { error } = schema.validate(req);
    if(error) {
        return validationMessageKey("validation", error);
    }
    return null;
}


export const resetPasswordValidation = async (req) => {
    const schema = Joi.object({
        email: Joi.string().required().email({ tlds: {allow: false} }),
        token: Joi.string().required().min(6).max(6).required(),
        password: JoiPassword
            .string()
            .minOfSpecialCharacters(1)
            .minOfLowercase(2)
            .minOfUppercase(1)
            .minOfNumeric(2)
            .noWhiteSpaces()
            .required(),
        confirmPassword: Joi.string().required().valid(Joi.ref("password"))
    }).unknown(true);
    const { error } = schema.validate(req);
    if(error) {
        return validationMessageKey("validation", error);
    }
    return null;
}