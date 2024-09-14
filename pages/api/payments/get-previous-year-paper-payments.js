const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
import { getPreviousYearPaperPayment } from "../../../services/payment.service";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const PaymentModel = require("../../../models/payments");

const getPreviousYearPayments = async(req, res) => {
    try {
        const { Model } = req.db;
        const user = req.user;
        console.log(user,"---------------------------UserData--------------------");

        if(!user?.department || !user?.exam) {
            return apiError(res,"ExamOrDepartmentNotFound", NOTFOUND);
        }

        let payments = await getPreviousYearPaperPayment(Model,user);
        if(!payments) return apiError(res,"PaymentDataNotFound", NOTFOUND);

        return successapi(res, "FetchedExamData", SUCCESS, payments);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getPreviousYearPayments,PaymentModel);