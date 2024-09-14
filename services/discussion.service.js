import { ObjectId } from "mongodb";

export const getQuestionWiseDiscussion = async (Model,data,user) => {
    try{
        let pipeline = [];
        
        // adding query into the pipeline array
        pipeline.push({
            $match: {
                $expr: {
                    $eq: [ '$questionId', ObjectId(data.id) ],
                    $eq: [ '$display', true ],
                },
            },
		});

        pipeline.push({
			$lookup: {
                from: "students",
                localField: "postedBy",
                foreignField: "_id",
                as: "postedBy",
            }
		});

        pipeline.push({
            $addFields: {
                postedBy: { $arrayElemAt: ["$postedBy", 0] },
            },
        });

        pipeline.push({
            $lookup: {
                from: "discussionvotes",
                let: {
                    discussionId: "$_id",
                    userId: user._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$discussionId", "$$discussionId"] },
                                    { $eq: ["$postedBy", "$$userId"] },
                                    { $eq: ["$direction", "upVote"] },
                                    { $eq: ["$vote", 1] },
                                ],
                            },
                        },
                    },
                    {
                        $count: "upvoteCount",
                    },
                ],
                as: "upvoted",
            },
        });

        // Add $lookup stage to fetch forumVotes
        pipeline.push({
            $lookup: {
                from: "discussionvotes",
                let: {
                    discussionId: "$_id",
                    userId: user._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$discussionId", "$$discussionId"] },
                                    { $eq: ["$postedBy", "$$userId"] },
                                    { $eq: ["$direction", "downVote"] },
                                    { $eq: ["$vote", 1] },
                                ],
                            },
                        },
                    },
                    {
                        $count: "downvoteCount",
                    },
                ],
                as: "downvoted",
            },
        });

        pipeline.push({
            $addFields: {
                isUpvoted: { $gt: [{ $size: "$upvoted" }, 0] },
                isDownvoted: { $gt: [{ $size: "$downvoted" }, 0] },
            },
        });
  
        pipeline.push({
            $project: {
                upvoted: 0,
                downvoted: 0,
            },
        });

        const result = await Model.aggregate(pipeline);
        console.log(result,"resultData");
        return result;
    }catch(error){
        console.log('error In FINDRANDOMREVIEWS ', error);
        return false;
    }
}