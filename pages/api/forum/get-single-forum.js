const withMiddleware = require("../middleware");
import { ObjectId } from "mongodb";
import { apiError, successapi } from "../../../helpers/responseHelper";
import { fetchSingleForumWithAnswer } from "../../../services/forum.service";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const ForumModel = require("../../../models/forum");

const getSingleForum = async (req, res) => {
    try {
        const { Model } = req.db;
        const user = req.user;
        let reqParam = req.query;
        console.log(reqParam,"reqParam");
        console.log(user, "---------------------------UserData--------------------");

        if(!user?.department || !user?.exam) {
            return apiError(res, "ExamOrDepartmentNotFound", NOTFOUND);
        };

        let forum = await fetchSingleForumWithAnswer(Model,user,reqParam);

        if (!forum) return apiError(res, "ForumDataNotFound", NOTFOUND);

        return successapi(res, "FetchedSingleForumData", SUCCESS, forum);
    } catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getSingleForum, ForumModel);