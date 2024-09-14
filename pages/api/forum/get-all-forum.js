// Import the required modules and models
const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
import { fetchAllForumWithSameDept } from "../../../services/forum.service";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const ForumModel = require("../../../models/forum");
const AnswerModel = require("../../../models/answers");
const SubjectModel = require("../../../models/subject");

// Define the getAllForums function
const getAllForums = async (req, res) => {
    try {
        // Get the Model and user properties from the request object
        const { Model } = req.db;
        const user = req.user;
        console.log(user, "---------------------------UserData--------------------");

        if (!user?.department || !user?.exam) {
            return apiError(res, "ExamOrDepartmentNotFound", NOTFOUND);
        };

        let forum = await fetchAllForumWithSameDept(Model,user);
        if(!forum) return apiError(res, "ForumDataNotFound", NOTFOUND);

        return successapi(res, "FetchedAllForumData", SUCCESS, forum);
    } catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getAllForums, ForumModel);