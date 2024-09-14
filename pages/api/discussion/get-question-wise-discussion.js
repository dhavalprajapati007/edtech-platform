const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
import { getQuestionWiseDiscussion } from "../../../services/discussion.service";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const DiscussionModel = require("../../../models/discussion");
const studentModel = require('../../../models/student');

const fetchQuesWiseDiscussions = async(req, res) => {
    try {
        const { Model } = req.db;
        const user = req.user;
        const reqParam = req.query;

        // let discussions = await Model.find({ questionId : reqParam.id }).populate('postedBy');
        let discussions = await getQuestionWiseDiscussion(Model,reqParam,user);
        if(!discussions) return successapi(res, "DiscussionDataNotFound", NOTFOUND);

        return successapi(res, "questionWiseDiscussionFetchedSuccessfully", SUCCESS, discussions);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(fetchQuesWiseDiscussions,DiscussionModel);