const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
import { fetchRandomReviews } from "../../../services/reviews.service";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const ReviewModel = require("../../../models/reviews");

const getRandomReviews = async(req, res) => {
    try {
        const { Model } = req.db;

        let randomReviews = await fetchRandomReviews(Model);
        if(!randomReviews) return apiError(res, "randomReviewsNotFound", NOTFOUND);

        return successapi(res, "RandomDepartmentReviews", SUCCESS, randomReviews);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(getRandomReviews,ReviewModel);