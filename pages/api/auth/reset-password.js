const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
import { resetPasswordValidation } from "../../../validations/auth.validation";
const { SUCCESS, SERVERERROR, FAILURE } = process.env;
const bcrypt = require("bcryptjs");
const studentModel = require("../../../models/student");

const resetPassword = async(req, res) => {
    try {
        const { Model } = req.db;
        let reqParam = JSON.parse(req.body);
        console.log(reqParam,"reqParam");
        
        // Validate Request
        let validationMessage = await resetPasswordValidation(reqParam);
        if(validationMessage) return apiError(res, validationMessage, SERVERERROR);

        //existing user
        const foundUser = await Model.findOne({
            username: reqParam.email.toLowerCase(),
        });

        console.log(foundUser,"foundUser");
        if(!foundUser) return successapi(res, "userNotRegisteredWithEmail", SUCCESS, { status: false });

        if(foundUser.resetPasswordCode == reqParam.token) {
            //saving user with new password
            await Model.findOneAndUpdate({
                username: reqParam.email.toLowerCase(),
            }, {
                $set: {
                    password: bcrypt.hashSync(reqParam.password),
                    resetToken: null
                }
            });
            return successapi(res, "passwordUpdatedSuccessfully", SUCCESS, { status: true });
        } else {
            return apiError(res, "resetTokenMismatch", FAILURE);
        }
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(resetPassword,studentModel);