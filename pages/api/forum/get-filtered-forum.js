const withMiddleware = require("../middleware");
import { ObjectId } from "mongodb";
import { apiError, successapi } from "../../../helpers/responseHelper";
import { fetchFilteredForum } from "../../../services/forum.service";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const ForumModel = require("../../../models/forum");
const AnswerModel = require("../../../models/answers");
const SubjectModel = require("../../../models/subject");

const getRecommendedForums = async (req, res) => {
    try {
        const { Model } = req.db;
        const user = req.user;
        let reqParam = JSON.parse(req.body);
        console.log(user, "---------------------------UserData--------------------");

        if (!user?.department || !user?.exam) {
            return apiError(res, "ExamOrDepartmentNotFound", NOTFOUND);
        };

        if(reqParam.type === 'question') {
            reqParam = {
                postedBy: ObjectId(reqParam.postedBy)
            }
        }else if(reqParam.type === 'subject') {
            reqParam = {
                subject: ObjectId(reqParam.subject)
            }
        }else {
            reqParam = {
                recommended: reqParam.recommended
            }
        }

        // let forum = await Model.find(reqParam).populate('answers').populate('postedBy').populate('subject').sort({ createdAt: -1 });
        let forum = await fetchFilteredForum(Model,user,reqParam);
        if (!forum) return apiError(res, "FilteredForumDataNotFound", NOTFOUND);

        return successapi(res, "FetchedFilteredForumData", SUCCESS, forum);
    } catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getRecommendedForums, ForumModel);