const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const BookmarkModel = require("../../../models/bookmarks");

const fetchBookmarkedQues = async(req, res) => {
    try {
        const { Model } = req.db;
        const user = req.user;

        let bookmarks = await Model.findOne({ postedBy : user._id });
        if(!bookmarks) return successapi(res, "BookMarkedDataNotFound", NOTFOUND);

        return successapi(res, "BookmarkedDataFetchedSuccessfully", SUCCESS, bookmarks);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(fetchBookmarkedQues,BookmarkModel);