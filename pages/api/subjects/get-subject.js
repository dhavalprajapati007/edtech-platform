const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const SubjectModel = require("../../../models/subject");

const getSubject = async(req, res) => {
    try {
        const { Model } = req.db;
        const reqParam = req.query;

        // Fetch Subject Record
        let subject = await Model.findById(reqParam.id);
        if(!subject) return apiError(res, "SubjectNotFound", NOTFOUND);

        // Success Response
        return successapi(res, "SubjectData", SUCCESS, subject);    
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getSubject,SubjectModel);