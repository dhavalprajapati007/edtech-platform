const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const SyllabusModel = require("../../../models/syllabus");

const getSyllabus = async(req, res) => {
    try {
        const user = req.user;
        const { Model } = req.db;
        const reqParam = JSON.parse(req.body);

        let syllabus;
        
        if(reqParam.exam) {
            syllabus = await Model.findOne({ department: reqParam.department, exam: reqParam.exam }).sort({ createdAt: -1 }).limit(1);
        }else {
            syllabus = await Model.findOne({ department: reqParam.department }).sort({ createdAt: -1 }).limit(1);
        }
        
        if(!syllabus) return apiError(res, "SyllabusNotFound", NOTFOUND);

        return successapi(res, "FetchedSyllabus", SUCCESS, syllabus);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getSyllabus,SyllabusModel);