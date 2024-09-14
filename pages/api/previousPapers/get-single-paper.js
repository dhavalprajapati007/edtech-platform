const withMiddleware = require("../middleware");
import { getPageAndLimit } from "../../../helpers/helper";
import { apiError, successapi } from "../../../helpers/responseHelper";
import { getSinglePaperById } from "../../../services/previousPapers.service";
import { getSingleFullLengthPaperValidation } from "../../../validations/previousPaper.validation";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const Question = require("../../../models/questions");
const PreviousPaperModel = require("../../../models/previousPapers");

const getSinglePaper = async(req, res) => {
    try {
        const { Model } = req.db;
        const user = req.user;
        let reqParam = JSON.parse(req.body);

        if(!user?.department || !user?.exam) {
            return apiError(res,"ExamOrDepartmentNotFound", NOTFOUND);
        }
        
        // Validate Request
        let validationMessage = await getSingleFullLengthPaperValidation(reqParam);
        if(validationMessage) return apiError(res, validationMessage, SERVERERROR);

        // const { limitCount, skipCount } = getPageAndLimit(reqParam.page, reqParam.limit);

        let paper = await Model.findOne({ _id: reqParam.id }).populate('sections.questions');
        
        if(!paper) return apiError(res, "PaperNotFound", NOTFOUND);

        return successapi(res, "FetchedPaper", SUCCESS, paper);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getSinglePaper,PreviousPaperModel);