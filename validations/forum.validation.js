import { validationMessageKey } from '../helpers/helper';
const Joi = require('joi');

export const addForumValidation = async (req) => {
    const schema = Joi.object({
        text: Joi.string().required(),
        files: Joi.array().optional(),
        subject: Joi.string().min(24).max(24).required()
    }).unknown(true);

    const { error } = schema.validate(req);

    if(error) {
        return validationMessageKey("validation", error);
    }

    return null;
}

export const editForumValidation = async (req) => {
    const schema = Joi.object({
        forumId: Joi.string().min(24).max(24).required(),
        text: Joi.string().required(),
        files: Joi.array().optional(),
        subject: Joi.string().min(24).max(24).required()
    }).unknown(true);

    const { error } = schema.validate(req);

    if(error) {
        return validationMessageKey("validation", error);
    }

    return null;
}

export const addForumAnswerValidation = async (req) => {
    const schema = Joi.object({
        text: Joi.string().required(),
        files: Joi.array().optional(),
        forum: Joi.string().min(24).max(24).required()
    }).unknown(true);

    const { error } = schema.validate(req);

    if(error) {
        return validationMessageKey("validation", error);
    }

    return null;
}

export const postDiscussionValidation = async (req) => {
    const schema = Joi.object({
        text: Joi.string().required(),
        files: Joi.array().optional(),
        id: Joi.string().min(24).max(24).required()
    }).unknown(true);

    const { error } = schema.validate(req);

    if(error) {
        return validationMessageKey("validation", error);
    }

    return null;
}

export const deleteForumAndAnswerValidation = async (req) => {
    const schema = Joi.object({
        userId: Joi.string().min(24).max(24).required(),
        forumId: Joi.string().min(24).max(24).required()
    }).unknown(true);

    const { error } = schema.validate(req);

    if(error) {
        return validationMessageKey("validation", error);
    }

    return null;
}

export const deleteForumCommentValidation = async (req) => {
    const schema = Joi.object({
        userId: Joi.string().min(24).max(24).required(),
        answerId: Joi.string().min(24).max(24).required()
    }).unknown(true);

    const { error } = schema.validate(req);

    if(error) {
        return validationMessageKey("validation", error);
    }

    return null;
}

export const deleteAnswerDiscussionValidation = async (req) => {
    const schema = Joi.object({
        userId: Joi.string().min(24).max(24).required(),
        discussionId: Joi.string().min(24).max(24).required()
    }).unknown(true);

    const { error } = schema.validate(req);

    if(error) {
        return validationMessageKey("validation", error);
    }

    return null;
}