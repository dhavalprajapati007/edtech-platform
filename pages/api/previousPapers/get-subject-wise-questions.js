const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
import { getSubjectWiseQuestionsForStudent } from "../../../services/previousPapers.service";
import { getSubjectWiseQuestionsValidation } from "../../../validations/previousPaper.validation";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const QuestionsModel = require("../../../models/questions");

const getSubjectWiseQuestions = async(req, res) => {
    try {
        const { Model } = req.db;
        const user = req.user;
        let reqParam = JSON.parse(req.body);

        console.log(user,"---------------------------UserData--------------------");

        if(!user?.department || !user?.exam) {
            return apiError(res,"ExamOrDepartmentNotFound", NOTFOUND);
        }

        // Validate Request
        let validationMessage = await getSubjectWiseQuestionsValidation(reqParam);
        if(validationMessage) return apiError(res, validationMessage, SERVERERROR);

        let subjectWiseQues = await getSubjectWiseQuestionsForStudent(Model,user,reqParam);
        if(!subjectWiseQues) return apiError(res, "SubjectWiseQuestionsNotFound", NOTFOUND);

        return successapi(res, "FetchedExamData", SUCCESS, subjectWiseQues);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getSubjectWiseQuestions,QuestionsModel);