const withMiddleware = require("../middleware");
import { ObjectId } from "mongodb";
import { apiError, successapi } from "../../../helpers/responseHelper";
import { submitReportValidation } from "../../../validations/report.validation";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const ReportModel = require("../../../models/reports");

const submitReport = async (req, res) => {
    try {
        const { Model } = req.db;
        const user = req.user;
        let reqParam = JSON.parse(req.body);
        console.log(reqParam,"reqParam");
        console.log(user,"---------------------------UserData--------------------");

        if(!user?.department || !user?.exam) {
            return apiError(res, "ExamOrDepartmentNotFound", NOTFOUND);
        };

        // validate request
        let validationMessage = await submitReportValidation(reqParam);
        if(validationMessage) return apiError(res, validationMessage, SERVERERROR);

        let existingReport = await Model.findOne({ postedBy: user._id, referenceId : ObjectId(reqParam.referenceId), type: reqParam.type });
        if(existingReport) return apiError(res, "youHaveAlreadyReported", SERVERERROR);

        // add votes in answervotes table 
        let report = new Model({
            type: reqParam.type,
            referenceId: reqParam.referenceId,
            reference: reqParam.reference,
            comment: reqParam.comment,
            postedBy: user._id,
            action: ""
        })

        // save vote
        let savedReport = await report.save();

        return successapi(res, `${reqParam.type}ReportedSuccessFully`, SUCCESS, savedReport);
    } catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(submitReport, ReportModel);