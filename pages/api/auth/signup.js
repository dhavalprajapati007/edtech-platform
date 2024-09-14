import { apiError, successapi } from "../../../helpers/responseHelper";
import { signupUserValidation } from "../../../validations/auth.validation";
const withMiddleware = require("../middleware");
const StudentModel = require("../../../models/student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SUCCESS, SERVERERROR, FAILURE, JWT_AUTH_TOKEN_SECRET, JWT_EXPIRES_IN } = process.env;

const signUp = async(req, res) => {
    try {
        const { Model } = req.db;
        let reqParam = JSON.parse(req.body);

        // validate request
        let validationMessage = await signupUserValidation(reqParam);
        if(validationMessage) return apiError(res, validationMessage, 500);

        // check user existence
        let foundStudent = await Model.findOne({ username : reqParam?.email });
        if(foundStudent) return apiError(res, "studentAlreadyExistWithSameEmail", FAILURE);
        
        // creating studentData as per schema
        let signUpData = Model({
            username : reqParam.email,
            password : bcrypt.hashSync(reqParam.password),
            name : reqParam.fullName,
            phone : reqParam.mobile,
            resetPasswordCode : "",
            exam : null,
            department : null
        })

        // save student
        let newStudent = await signUpData.save();

        // tokenObject to create token
        let tokenObject = {
            _id: newStudent._id,
            name: newStudent.name,
            userName: newStudent.username,
        };

        // create token
        var tokenData = jwt.sign({ tokenObject }, JWT_AUTH_TOKEN_SECRET, { expiresIn: JWT_EXPIRES_IN });

        return successapi(res, "studentRegistered", SUCCESS, { studentData : newStudent, tokenData });
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(signUp,StudentModel);