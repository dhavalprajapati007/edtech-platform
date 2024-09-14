import fs from 'fs';
import path from 'path';
import { apiError, successapi } from "../../../helpers/responseHelper";
import { sendEmail } from "../../../services/Mailer";
import { forgotPasswordValidation } from "../../../validations/auth.validation";
const studentModel = require("../../../models/student");
const withMiddleware = require("../middleware");
const { SUCCESS, SERVERERROR } = process.env;

const forgotPassword = async(req, res) => {
    try {
        const { Model } = req.db;
        let reqParam = JSON.parse(req.body);
        console.log(reqParam,"reqParam");
        
        // Validate Request
        let validationMessage = await forgotPasswordValidation(reqParam);
        if(validationMessage) return apiError(res, validationMessage, SERVERERROR);

        //existing user
        const foundUser = await Model.findOne({
            username: reqParam.email.toLowerCase(),
        });

        if(!foundUser) return successapi(res, "userNotRegisteredWithEmail", SUCCESS, { status: false });

        //generating reset token
        const resetToken = Math.floor(100000 + Math.random() * 900000);

        //updating reset token
        await Model.findOneAndUpdate({
            username: reqParam.email.toLowerCase(),
        }, {
            $set: {
                resetPasswordCode: resetToken
            }
        });

        // read the contents of the resetToken.html file
        const htmlContent = fs.readFileSync(path.join(process.cwd(), 'view', 'resetToken.html'), 'utf8');

        // replace the placeholder value with the actual reset token value
        const messageHtml = htmlContent.replace('{{resetToken}}', resetToken);

        // send the email
        await sendEmail(foundUser.username, messageHtml, "Forgot Password Reset Token");

        return successapi(res, "ResetPasswordTokenSentViaMail", SUCCESS, { status: true });
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(forgotPassword,studentModel);