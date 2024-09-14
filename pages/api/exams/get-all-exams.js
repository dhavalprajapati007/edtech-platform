const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const ExamModel = require("../../../models/exams");

const getAllExams = async(req, res) => {
    try {
        const { Model } = req.db;

        let exams = await Model.find({ display : true }).sort({ _id : 1 });
        if(!exams) return apiError(res, "ExamNotFound", NOTFOUND);

        return successapi(res, "FetchedExamData", SUCCESS, exams);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getAllExams,ExamModel);