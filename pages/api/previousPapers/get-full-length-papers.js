const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
import { getAllPapersForStudent } from "../../../services/previousPapers.service";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const PreviousPaperModel = require("../../../models/previousPapers");


const getFullLengthPapers = async(req, res) => {
    try {
        const { Model } = req.db;
        const user = req.user;
        console.log(user,"---------------------------UserData--------------------");

        if(!user?.department || !user?.exam) {
            return apiError(res,"ExamOrDepartmentNotFound", NOTFOUND);
        }

        let papers = await getAllPapersForStudent(Model,user);
        if(!papers) return apiError(res, "PapersNotFound", NOTFOUND);

        return successapi(res, "FetchedPaperData", SUCCESS, papers);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getFullLengthPapers,PreviousPaperModel);