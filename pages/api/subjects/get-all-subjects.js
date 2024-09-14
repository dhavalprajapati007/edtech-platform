const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
const { SUCCESS, SERVERERROR, NOTFOUND, FAILURE } = process.env;
const SubjectModel = require("../../../models/subject");

const getAllSubject = async(req, res) => {
    try {
        const { Model } = req.db;

        // Fetch Subject Record
        let subject = await Model.find({});
        if(!subject) return apiError(res, "SubjectNotFound", NOTFOUND);

        // Success Response
        return successapi(res, "SubjectData", SUCCESS, subject);    
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getAllSubject,SubjectModel);