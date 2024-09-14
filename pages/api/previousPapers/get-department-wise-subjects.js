const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
import { getSubjectWisePapersForStudent } from "../../../services/previousPapers.service";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const DepartmentModel = require("../../../models/departments");


const getSubjectWisePapers = async(req, res) => {
    try {
        const { Model } = req.db;
        const user = req.user;
        console.log(user,"---------------------------UserData--------------------");

        if(!user?.department || !user?.exam) {
            return apiError(res,"ExamOrDepartmentNotFound", NOTFOUND);
        }

        let subjectWisepapers = await getSubjectWisePapersForStudent(Model,user);
        if(!subjectWisepapers) return apiError(res, "PapersNotFound", NOTFOUND);

        return successapi(res, "FetchedExamData", SUCCESS, subjectWisepapers);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getSubjectWisePapers,DepartmentModel);