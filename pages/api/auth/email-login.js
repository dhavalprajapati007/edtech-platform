import { getStudentData } from "../../../helpers/loginHelper";
import { apiError, successapi } from "../../../helpers/responseHelper";
import { loginUserValidation } from "../../../validations/auth.validation";
const withMiddleware = require("../middleware");
const StudentModel = require("../../../models/student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SUCCESS, SERVERERROR, JWT_AUTH_TOKEN_SECRET, JWT_EXPIRES_IN, NOTFOUND, FAILURE } = process.env;

const emailLogin = async(req, res) => {
    try {
        const { Model } = req.db;
        let reqParam = req.body;
        console.log(reqParam,'reqParam');

        // validate request
        let validationMessage = await loginUserValidation(reqParam);
        if(validationMessage) return apiError(res, validationMessage, SERVERERROR);

        let student = await Model.findOne({ username : reqParam?.email });
        console.log(student,'studentDetails');
        if(!student) return apiError(res, "StudentNotFound", NOTFOUND);

        // if student exist then match the password
        if(bcrypt.compareSync(reqParam.password, student.password)) {
            let tokenObject = {
                _id: student._id,
                name: student.name,
                userName: student.username,
            };

            //token create
            var tokenData = await jwt.sign({ tokenObject }, JWT_AUTH_TOKEN_SECRET, { expiresIn: JWT_EXPIRES_IN });

            // fetch finalize student data
            let studentData = await getStudentData(student,tokenData,"email");
            
            return successapi(res, "studentLogedIn", SUCCESS, studentData);
        }else {
            return apiError(res,"incorrectPassword", FAILURE);
        }
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(emailLogin,StudentModel);