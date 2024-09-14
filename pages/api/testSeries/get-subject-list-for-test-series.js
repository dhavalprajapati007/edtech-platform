const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
import { getSubjectList } from "../../../services/testSeries.service";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const TestSeriesModel = require("../../../models/testSeries");

const getSubjectListForTestSeries = async(req, res) => {
    try {
        const { Model } = req.db;
        const user = req.user;
        console.log(user,"---------------------------UserData--------------------");

        if(!user?.department || !user?.exam) {
            return apiError(res,"ExamOrDepartmentNotFound", NOTFOUND);
        }

        let subjectList = await getSubjectList(Model,user);
        if(!subjectList) return apiError(res, "SubjectListNotFound", NOTFOUND);

        return successapi(res, "FetchedExamData", SUCCESS, subjectList);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getSubjectListForTestSeries,TestSeriesModel);