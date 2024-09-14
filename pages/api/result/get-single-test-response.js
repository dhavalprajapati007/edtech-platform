const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const ResponseSheetModel = require("../../../models/responseSheet");

const getSingleTestResult = async(req, res) => {
    try {
        const { Model } = req.db;
        const user = req.user;
        const reqParam = JSON.parse(req.body);

        let result = await Model.findOne({ referenceId : reqParam.id, userId : user._id, mode: reqParam.mode });
        if(!result) return apiError(res, "testResponseDataNotFound", NOTFOUND);

        return successapi(res, "testResultFetchedSuccessfully", SUCCESS, result);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getSingleTestResult,ResponseSheetModel);