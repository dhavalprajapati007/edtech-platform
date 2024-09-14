const withMiddleware = require("../middleware");
import { ObjectId } from "mongodb";
import { apiError, successapi } from "../../../helpers/responseHelper";
import { editForumValidation } from "../../../validations/forum.validation";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const ForumModel = require("../../../models/forum");

const editForum = async (req, res) => {
    try {
        const { Model } = req.db;
        const user = req.user;
        let reqParam = JSON.parse(req.body);
        
        console.log(reqParam,"reqParam");
        console.log(user,'userData');

        if(!user?.department || !user?.exam) {
            return apiError(res, "ExamOrDepartmentNotFound", NOTFOUND);
        };

        // validate request
        let validationMessage = await editForumValidation(reqParam);
        if(validationMessage) return apiError(res, validationMessage, SERVERERROR);

        // update forum details in forums db
        let updateForum = await Model.findOneAndUpdate({
            _id: ObjectId(reqParam.forumId),
        }, {
            $set: {
                text: reqParam.text,
                subject: reqParam.subject,
                files: reqParam.files,
                department: user.department
            }
        });

        return successapi(res, "ForumDataUpdatedSuccessFully", SUCCESS, updateForum);
    } catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(editForum, ForumModel);