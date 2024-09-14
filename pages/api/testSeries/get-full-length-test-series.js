const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
import { getFullLengthTestSeries } from "../../../services/testSeries.service";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const TestSeriesModel = require("../../../models/testSeries");

const getFullTestSeries = async(req, res) => {
    try {
        const { Model } = req.db;
        const user = req.user;
        console.log(user,"---------------------------UserData--------------------");

        if(!user?.department || !user?.exam) {
            return apiError(res,"ExamOrDepartmentNotFound", NOTFOUND);
        }

        let fullLengthTestSeries = await getFullLengthTestSeries(Model,user);
        if(!fullLengthTestSeries) return apiError(res, "TestSeriesNotFound", NOTFOUND);

        return successapi(res, "FetchedTestSeriesData", SUCCESS, fullLengthTestSeries);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getFullTestSeries,TestSeriesModel);