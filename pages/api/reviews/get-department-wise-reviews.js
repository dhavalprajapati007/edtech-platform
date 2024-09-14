const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
import { getDepartmentWiseReviewsValidation } from "../../../validations/reviews.validation";
const { SUCCESS, SERVERERROR, NOTFOUND, FAILURE } = process.env;

const ReviewModel = require("../../../models/reviews");

const getDepartmentReviews = async(req, res) => {
    try {
        const { Model } = req.db;
        let reqParam = JSON.parse(req.body);
        console.log(reqParam,"reqParam");
        
        // Validate Request
        let validationMessage = await getDepartmentWiseReviewsValidation(reqParam);
        if(validationMessage) return apiError(res, validationMessage, SERVERERROR);

        let reviews = await Model.findOne({ department : reqParam?.id });
        if(!reviews) return apiError(res, "DepartmentWiseReviewsNotFound", NOTFOUND);

        return successapi(res, "FetchedDepartmentReviews", SUCCESS, reviews);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getDepartmentReviews,ReviewModel);