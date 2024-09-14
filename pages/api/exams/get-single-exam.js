const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const ExamModel = require("../../../models/exams");
var ObjectId = require("mongodb").ObjectID;

const getSingleExam = async(req, res) => {
    try {
        const { Model } = req.db;
        const reqParam = req.query;

        let exam = await Model.findOne(ObjectId(reqParam.id));
        if(!exam) return apiError(res, "ExamDetailNotFound", NOTFOUND);

        return successapi(res, "FetchedExamDetail", SUCCESS, exam);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getSingleExam,ExamModel);