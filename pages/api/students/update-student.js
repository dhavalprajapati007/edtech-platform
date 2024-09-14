const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
const { SUCCESS, SERVERERROR, NOTFOUND, FAILURE } = process.env;
const StudentModel = require("../../../models/student");

const updateStudentDetails = async(req, res) => {
    try {
        const { Model } = req.db;
        let  student  = req.user;
        let reqParam = JSON.parse(req.body);

        // Update student record
        let updateStudent = await Model.findOneAndUpdate({ _id: student._id }, reqParam, {new : true});

        // Success Response
        if(updateStudent) return successapi(res, "StudentDataUpdated", SUCCESS, updateStudent);
            
        // Error Response
        return responseHelper.error(res, res.__("errorUpdatingStudentRecord"), FAILURE);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(updateStudentDetails,StudentModel);