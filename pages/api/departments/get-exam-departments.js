const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
import { fetchExamDepartments } from "../../../services/department.service";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const ExamModel = require("../../../models/exams");


const getExamSpecificDepartments = async(req, res) => {
    try {
        const { Model } = req.db;
        let reqParam = JSON.parse(req.body);

        let examDepartment = await fetchExamDepartments(Model,reqParam);
        if(!examDepartment) return apiError(res, "DepartmentNotFound", NOTFOUND);

        return successapi(res, "FetchedExamData", SUCCESS, examDepartment);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getExamSpecificDepartments,ExamModel);