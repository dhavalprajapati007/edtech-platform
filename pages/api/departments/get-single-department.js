const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const DepartmentModel = require("../../../models/departments");
const SubjectModel = require("../../../models/subject");
var ObjectId = require("mongodb").ObjectID;

const getSingleDepartment = async(req, res) => {
    try {
        const { Model } = req.db;
        const reqParam = req.query;

        let department = await Model.findOne(ObjectId(reqParam.id));
        if(!department) return apiError(res, "DepartmentDetailNotFound", NOTFOUND);

        return successapi(res, "FetchedDeptDetail", SUCCESS, department);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getSingleDepartment,DepartmentModel);