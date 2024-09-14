const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
import { addForumAnswerValidation } from "../../../validations/forum.validation";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const AnswerModel = require("../../../models/answers");

const saveForumAnswer = async (req, res) => {
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
        let validationMessage = await addForumAnswerValidation(reqParam);
        if(validationMessage) return apiError(res, validationMessage, SERVERERROR);

        // add votes in answervotes table 
        let answer = new Model({
            postedBy: user._id,
            files: reqParam.files,
            text: reqParam.text,
            upVotes: 0,
            downVotes: 0,
            forum: reqParam.forum,
            display: true           
        })

        // save forum answer
        let savedAnswer = await answer.save();

        return successapi(res, "ForumAnswerSavedSuccessFully", SUCCESS, savedAnswer);
    } catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(saveForumAnswer,AnswerModel);