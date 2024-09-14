const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const ResponseSheetModel = require("../../../models/responseSheet");

const getFilteredTest = async(req, res) => {
    try {
        const { Model } = req.db;
        const user = req.user;
        const reqParam = req.query;

        let results = await Model.find({ userId : user._id, mode: reqParam.mode });

        if(!results || results.length === 0) {
            return apiError(res, "filteredTestDataNotFound", NOTFOUND);
        }

        let referenceIds = results.map((result) => result.referenceId);

        return successapi(res, "filteredTestFetchedSuccessfully", SUCCESS, referenceIds);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getFilteredTest,ResponseSheetModel);