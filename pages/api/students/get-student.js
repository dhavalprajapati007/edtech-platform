const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
const { SUCCESS, SERVERERROR, NOTFOUND, FAILURE } = process.env;
const StudentModel = require("../../../models/student");

const getStudent = async(req, res) => {
    try {
        const { Model } = req.db;
        const reqParam = req.query;

        // Update student record
        let student = await Model.findOne({ _id: reqParam.id });
        if(!student) return apiError(res, "StudentNotFound", NOTFOUND);

        // Success Response
        return successapi(res, "StudentData", SUCCESS, student);    
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getStudent,StudentModel);