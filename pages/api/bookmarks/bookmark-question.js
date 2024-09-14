const withMiddleware = require("../middleware");
import { apiError, successapi } from "../../../helpers/responseHelper";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const BookmarkModel = require("../../../models/bookmarks");

const bookmarkQuestion = async (req, res) => {
    try {
        const { Model } = req.db;
        const user = req.user;
        const reqParam = JSON.parse(req.body);
        console.log(reqParam,"reqBody");
        console.log(user,"---------------------------UserData--------------------");

        if(!user?.department || !user?.exam) {
            return apiError(res, "ExamOrDepartmentNotFound", NOTFOUND);
        };

        let existingBookmark = await Model.findOne({ postedBy: user._id });
        console.log(existingBookmark,"existingBookmark");

        if(existingBookmark) {
            // Collection found, update the questions array
            if(existingBookmark.questions?.length && existingBookmark.questions.some((question) => question.question_id.valueOf() === reqParam.question_id)) {
                console.log("calledInIf");
                // Question ID already exists, remove it
                existingBookmark.questions = existingBookmark.questions.filter((questionId) => questionId.question_id.valueOf() !== reqParam.question_id);
            }else {
                // Question ID doesn't exist, add it
                existingBookmark.questions?.push(reqParam);
            }
      
            let updatedBookmarks = await existingBookmark.save();
            return successapi(res, `Bookmark updated successfully`, SUCCESS, updatedBookmarks);
        }else {
            // Collection not found, create a new one
            let bookmark = new Model({
                questions: [reqParam],
                postedBy: user._id,
            });
        
            let savedBookmark = await bookmark.save();
            return successapi(res, `Bookmark created successfully`, SUCCESS, savedBookmark);
        }
    } catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(bookmarkQuestion, BookmarkModel);