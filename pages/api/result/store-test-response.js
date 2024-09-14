const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
import { submitTestResultValidation } from "../../../validations/result.validation";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const ResponseSheetModel = require("../../../models/responseSheet");

const submitTestResult = async(req, res) => {
    try {
        const { Model } = req.db;
        const user = req.user;
        let reqParam = JSON.parse(req.body);

        console.log(user,"---------------------------UserData--------------------");

        if(!user?.department || !user?.exam) {
            return apiError(res,"ExamOrDepartmentNotFound", NOTFOUND);
        }

        // Validate Request
        let validationMessage = await submitTestResultValidation(reqParam);
        if(validationMessage) return apiError(res, validationMessage, SERVERERROR);

        let resultData = await Model.findOne({
            referenceId: reqParam.referenceId,
            userId: user._id,
            mode: reqParam.mode,
        });
        console.log(resultData, 'resultData');
      
        if(resultData) {
            // If result data is available, update it
            resultData.totalQuestions = reqParam.totalQuestions;
            resultData.remainingTime = reqParam.remainingTime;
            resultData.sections = reqParam.sections;
            resultData.unattempted = reqParam.unattempted;
            resultData.correctAns = reqParam.correctAns;
            resultData.wrongAns = reqParam.wrongAns;
            resultData.positiveMarks = reqParam.positiveMarks;
            resultData.negativeMarks = reqParam.negativeMarks;
            resultData.finalMarks = reqParam.finalMarks;
            resultData.totalMarks = reqParam.totalMarks;
            resultData.noOfAttempts += 1;
      
            let savedResult = await resultData.save();
      
            return successapi(res, "ResultDataUpdatedSuccessfully", SUCCESS, savedResult);
        }else {
            // If result data is not available, create a new entry
            let result = Model({
                userId: user._id,
                referenceId: reqParam.referenceId,
                exam: reqParam.exam,
                department: reqParam.department,
                title: reqParam.title,
                mode: reqParam.mode,
                totalQuestions: reqParam.totalQuestions,
                duration: reqParam.duration,
                remainingTime: reqParam.remainingTime,
                sections: reqParam.sections,
                unattempted: reqParam.unattempted,
                correctAns: reqParam.correctAns,
                wrongAns: reqParam.wrongAns,
                positiveMarks: reqParam.positiveMarks,
                negativeMarks: reqParam.negativeMarks,
                finalMarks: reqParam.finalMarks,
                totalMarks: reqParam.totalMarks,
                noOfAttempts: 1
            })
                
            let savedResult = await result.save();

            return successapi(res, "ResultDataSubmitedSuccessFully", SUCCESS, savedResult);
        }
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(submitTestResult,ResponseSheetModel);