const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
import { addForumValidation } from "../../../validations/forum.validation";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const ForumModel = require("../../../models/forum");

const saveForum = async (req, res) => {
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
        let validationMessage = await addForumValidation(reqParam);
        if(validationMessage) return apiError(res, validationMessage, SERVERERROR);

        // add new forum in forums table 
        let forum = new Model({
            postedBy: user._id,
            recommended: false,
            display: true,
            files: reqParam.files,
            answers: [],
            text: reqParam.text,
            upVotes: 0,
            downVotes: 0,
            subject: reqParam.subject,
            department: user.department
        })

        // save forum
        let savedForum = await forum.save();

        return successapi(res, "ForumDataSavedSuccessFully", SUCCESS, savedForum);
    } catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(saveForum, ForumModel);