const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const ExamAnalysisModel = require("../../../models/examAnalysis");

const getExamAnalysis = async(req, res) => {
    try {
        const user = req.user;
        const { Model } = req.db;
        const reqParam = JSON.parse(req.body);

        let examAnalysis;
        
        if(reqParam.exam) {
            examAnalysis = await Model.findOne({ department: reqParam.department, exam: reqParam.exam }).sort({ createdAt: -1 }).limit(1);
        }else {
            examAnalysis = await Model.findOne({ department: reqParam.department }).sort({ createdAt: -1 }).limit(1);
        }
        
        if(!examAnalysis) return apiError(res, "ExamAnalysisNotFound", NOTFOUND);

        return successapi(res, "FetchedExamAnalysis", SUCCESS, examAnalysis);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getExamAnalysis,ExamAnalysisModel);