const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
import { fetchFilteredBookmarks } from "../../../services/bookmark.service";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const BookmarkModel = require("../../../models/bookmarks");

const fetchFilteredBookmarkedQues = async(req, res) => {
    try {
        const { Model } = req.db;
        const user = req.user;

        let bookmarks = await fetchFilteredBookmarks(Model,user);
        console.log(bookmarks,'bookmarkedData');
        if(!bookmarks) return successapi(res, "BookMarkedDataNotFound", NOTFOUND);

        return successapi(res, "BookmarkedDataFetchedSuccessfully", SUCCESS, bookmarks);
    }catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(fetchFilteredBookmarkedQues,BookmarkModel);