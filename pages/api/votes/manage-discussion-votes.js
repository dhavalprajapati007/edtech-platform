const withMiddleware = require("../middleware");
import { ObjectId } from "mongodb";
import { apiError, successapi } from "../../../helpers/responseHelper";
const { SUCCESS, SERVERERROR, NOTFOUND } = process.env;
const DiscussionVotesModel = require("../../../models/discussionVotes");
const DiscussionModel = require("../../../models/discussion");

const updateVote = async (req, res) => {
    try {
        const { Model } = req.db;
        const user = req.user;
        let reqParam = JSON.parse(req.body);
        console.log(reqParam,"reqParam");
        console.log(user,"---------------------------UserData--------------------");

        if (!user?.department || !user?.exam) {
            return apiError(res, "ExamOrDepartmentNotFound", NOTFOUND);
        };

        let votes = await Model.find({ postedBy: user._id, discussionId: ObjectId(reqParam.discussionId), direction: reqParam.direction })
        .sort({ createdAt: -1 })
        .limit(1)
        .exec();

        // delete the last found record in upvote/downvote
        if(votes.length > 0) {
            const lastVote = votes[0];
            await Model.deleteOne({ _id: lastVote._id }).exec();
        }
        
        let voteCount = votes?.length ? votes[0].vote === 1 ? -1 : 1 : 1;

        // add votes in forumVotes table 
        let addVote = new Model({
            discussionId: reqParam.discussionId,
            postedBy: user._id,
            vote: voteCount,
            direction: reqParam.direction
        });

        // save vote
        let savedVotes = await addVote.save();

        return successapi(res, `${reqParam.direction}UpdatedSuccessFully`, SUCCESS, savedVotes);
    } catch (error) {
        console.log('error', error);
        return apiError(res, "SomethingWentWrongPleaseTryAgain", SERVERERROR);
    }
}

export default withMiddleware(updateVote, DiscussionVotesModel);