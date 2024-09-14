import { sendAppLink } from "../../../services/SendSMS";
import { apiError, successapi } from "../../../helpers/responseHelper";
const { SUCCESS, SERVERERROR, APP_LINK } = process.env;
const withMiddleware = require("../middleware");

const sendTextMessage = async (req, res) => {
    try {
        const { mobileNumber } = JSON.parse(req.body);

        await sendAppLink(mobileNumber);
        
        console.log("App link sent successfully");
        return successapi(res, "App link sent successfully", SUCCESS);
    } catch (error) {
        console.error("Failed to send app link:", error);
        return apiError(res, error.message || "Something went wrong. Please try again.", SERVERERROR);
    }
};

export default withMiddleware(sendTextMessage);