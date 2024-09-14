const withMiddleware = require("../middleware");
import { ObjectId } from "mongodb";
import { apiError, successapi } from "../../../helpers/responseHelper";
import { deleteForumAndAnswerValidation } from "../../../validations/forum.validation";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const ForumModel = require("../../../models/forum");

const deleteForumAndAnswer = async (req, res) => {
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
        let validationMessage = await deleteForumAndAnswerValidation(reqParam);
        if(validationMessage) return apiError(res, validationMessage, SERVERERROR);

        // update forum, change display property to false
        let updateForum = await Model.updateOne(
            { _id: ObjectId(reqParam.forumId), postedBy: ObjectId(reqParam.userId) },
            { $set: { display: false } }
        );          

        return successapi(res, "ForumAndItsAnswerDeletedSuccessFully", SUCCESS, updateForum);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(deleteForumAndAnswer,ForumModel);