const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
import { getDepWisePayment } from "../../../services/payment.service";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const PaymentModel = require("../../../models/payments");

const getDepartmentWisePayments = async(req, res) => {
    try {
        const { Model } = req.db;
        let reqParam = req.query;
        console.log(reqParam,"---------------------------reqParam--------------------");

        let payments = await getDepWisePayment(Model,reqParam);
        if(!payments) return apiError(res,"PaymentDataNotFound", NOTFOUND);

        return successapi(res, "FetchedExamData", SUCCESS, payments);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getDepartmentWisePayments,PaymentModel);