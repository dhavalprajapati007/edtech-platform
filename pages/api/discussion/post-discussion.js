const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
import { postDiscussionValidation } from "../../../validations/forum.validation";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const DiscussionModel = require("../../../models/discussion");

const saveDiscussion = async (req, res) => {
    try {
        const { Model } = req.db;
        const user = req.user;
        let reqParam = JSON.parse(req.body);
        console.log(reqParam,"reqParam");
        console.log(user, "---------------------------UserData--------------------");

        if (!user?.department || !user?.exam) {
            return apiError(res, "ExamOrDepartmentNotFound", NOTFOUND);
        };

        // validate request
        let validationMessage = await postDiscussionValidation(reqParam);
        if(validationMessage) return apiError(res, validationMessage, SERVERERROR);

        // add votes in answervotes table 
        let discussion = new Model({
            postedBy: user._id,
            files: reqParam.files,
            text: reqParam.text,
            recommended: false,
            display: true,
            questionId: reqParam.id,
        })

        // save forum answer
        let savedDiscussion = await discussion.save();

        return successapi(res, "ForumAnswerSavedSuccessFully", SUCCESS, savedDiscussion);
    } catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(saveDiscussion,DiscussionModel);