const withMiddleware = require("../middleware");
import { ObjectId } from "mongodb";
import { apiError, successapi } from "../../../helpers/responseHelper";
import { deleteForumCommentValidation } from "../../../validations/forum.validation";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const AnswerModel = require("../../../models/answers");

const deleteForumComment = async (req, res) => {
    try {
        const { Model } = req.db;
        const user = req.user;
        let reqParam = JSON.parse(req.body);

        if(!user?.department || !user?.exam) {
            return apiError(res, "ExamOrDepartmentNotFound", NOTFOUND);
        };

        if(!user?._id?.equals(reqParam?.userId)) {
            return apiError(res, "LoginUserMustBeAuthor", SERVERERROR);
        }

        // validate request
        let validationMessage = await deleteForumCommentValidation(reqParam);
        if(validationMessage) return apiError(res, validationMessage, SERVERERROR);

        // update comment, change display property to false
        let updateComment = await Model.updateOne(
            { _id: ObjectId(reqParam.answerId), postedBy: ObjectId(reqParam.userId) },
            { $set: { display: false } }
        ); 

        return successapi(res, "ForumCommentDeletedSuccessFully", SUCCESS, updateComment);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(deleteForumComment,AnswerModel);