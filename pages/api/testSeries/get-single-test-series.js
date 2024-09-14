const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
import { getSingleTestSeriesValidation } from "../../../validations/testSeries.validation";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const Question = require("../../../models/questions");
const TestSeriesModel = require("../../../models/testSeries");

const getSingleTestSeries = async(req, res) => {
    try {
        const { Model } = req.db;
        const user = req.user;
        let reqParam = JSON.parse(req.body);

        if(!user?.department || !user?.exam) {
            return apiError(res,"ExamOrDepartmentNotFound", NOTFOUND);
        }
        
        // Validate Request
        let validationMessage = await getSingleTestSeriesValidation(reqParam);
        if(validationMessage) return apiError(res, validationMessage, SERVERERROR);

        let testSeries = await Model.findOne({ _id: reqParam.id }).populate('sections.questions');
        
        if(!testSeries) return apiError(res, "TestSeriesNotFound", NOTFOUND);

        return successapi(res, "FetchedPaper", SUCCESS, testSeries);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getSingleTestSeries,TestSeriesModel);