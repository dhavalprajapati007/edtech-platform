const withMiddleware = require("../middleware");
import { ObjectId } from "mongodb";
import { apiError, successapi } from "../../../helpers/responseHelper";
import { deleteAnswerDiscussionValidation } from "../../../validations/forum.validation";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const DiscussionModel = require("../../../models/discussion");

const deleteQuesDiscussion = async (req, res) => {
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
        let validationMessage = await deleteAnswerDiscussionValidation(reqParam);
        if(validationMessage) return apiError(res, validationMessage, SERVERERROR);

        // update discussion, change display property to false
        let updateQuesDiscussion = await Model.updateOne(
            { _id: ObjectId(reqParam.discussionId), postedBy: ObjectId(reqParam.userId) },
            { $set: { display: false } }
        );

        return successapi(res, "AnswerDiscussionDeletedSuccessFully", SUCCESS, updateQuesDiscussion);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(deleteQuesDiscussion,DiscussionModel);