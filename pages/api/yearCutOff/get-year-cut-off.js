const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const YearCutOffModel = require("../../../models/yearCutOffs");

const getYearCutOff = async(req, res) => {
    try {
        const user = req.user;
        const { Model } = req.db;
        const reqParam = JSON.parse(req.body);

        let yearCutOff;
        
        if(reqParam.exam) {
            yearCutOff = await Model.findOne({ department: reqParam.department, exam: reqParam.exam }).sort({ createdAt: -1 }).limit(1);
        }else {
            yearCutOff = await Model.findOne({ department: reqParam.department }).sort({ createdAt: -1 }).limit(1);
        }
        
        if(!yearCutOff) return apiError(res, "YearCutOffNotFound", NOTFOUND);

        return successapi(res, "FetchedYearCutOff", SUCCESS, yearCutOff);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getYearCutOff,YearCutOffModel);