import { getStudentData } from "../../../helpers/loginHelper";
import { apiError, successapi } from "../../../helpers/responseHelper";
const StudentModel = require("../../../models/student");
const withMiddleware = require("../middleware");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { SUCCESS, SERVERERROR, JWT_AUTH_TOKEN_SECRET, JWT_EXPIRES_IN } = process.env;

const googleLogin = async(req, res) => {
    try {
        const { Model } = req.db;
        let reqParam = JSON.parse(req.body);

        let student = await Model.findOne({ username : reqParam?.email });
        if(!student) {
            let registerStudent = Model({
                username : reqParam.email,
                password : bcrypt.hashSync("google"),
                name : reqParam.fullName,
                phone : "",
                resetPasswordCode : "",
                exam : null,
                department : null
            })

            student = await registerStudent.save();
        };

        // tokenObject to create token
        let tokenObject = {
            _id: student._id,
            name: student.name,
            userName: student.username,
        };

        //token create
        var tokenData = jwt.sign({ tokenObject }, JWT_AUTH_TOKEN_SECRET, { expiresIn: JWT_EXPIRES_IN });

        // fetch finalize student data
        let studentData = await getStudentData(student,tokenData,"google");

        return successapi(res, "studentLogedIn", SUCCESS, studentData);
    } catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    } 
}

export default withMiddleware(googleLogin,StudentModel);