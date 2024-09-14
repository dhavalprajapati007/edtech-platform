const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const QuestionModel = require("../../../models/questions");

const getSingleQuestion = async(req, res) => {
    try {
        const { Model } = req.db;
        const reqParam = req.query;

        let question = await Model.findOne({ _id : reqParam.id });
        if(!question) return apiError(res, "QuestionNotFound", NOTFOUND);

        return successapi(res, "questionFetchedSuccessfully", SUCCESS, question);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getSingleQuestion,QuestionModel);