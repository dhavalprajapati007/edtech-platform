const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
import { fetchAllDepartments } from "../../../services/department.service";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const DepartmentModel = require("../../../models/departments");


const getAllDepartments = async(req, res) => {
    try {
        const { Model } = req.db;

        let departments = await fetchAllDepartments(Model);
        if(!departments) return apiError(res, "DepartmentNotFound", NOTFOUND);

        return successapi(res, "FetchedAllDeptData", SUCCESS, departments);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getAllDepartments,DepartmentModel);