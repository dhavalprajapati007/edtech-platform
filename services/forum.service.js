import { ObjectId } from "mongodb";

export const fetchAllForumWithSameDept = async (Model, user) => {
    try {
        let pipeline = [];

        pipeline.push({
            $match: {
                $expr: {
                    $and: [
                        { $eq: ["$department", user.department] },
                        { $eq: ["$display", true] },
                    ]
                },
            },
        });

        pipeline.push({
            $lookup: {
                from: "answers",
                let: { answerIds: "$answers" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $in: ["$_id", "$$answerIds"] },
                                    { $eq: ["$display", true] },
                                ]
                            },
                        },
                    },
                    {
                        $lookup: {
                            from: "students",
                            localField: "postedBy",
                            foreignField: "_id",
                            as: "postedBy",
                        },
                    },
                    {
                        $addFields: {
                            postedBy: { $arrayElemAt: ["$postedBy", 0] },
                        },
                    },
                ],
                as: "answers",
            },
        });

        pipeline.push({
            $lookup: {
                from: "students",
                localField: "postedBy",
                foreignField: "_id",
                as: "postedBy",
            },
        });

        pipeline.push({
            $lookup: {
                from: "subjects",
                localField: "subject",
                foreignField: "_id",
                as: "subject",
            },
        });

        pipeline.push({
            $addFields: {
                postedBy: { $arrayElemAt: ["$postedBy", 0] },
                subject: { $arrayElemAt: ["$subject", 0] },
                answerCount: { $size: "$answers" },
            },
        });

        pipeline.push({
            $addFields: {
                answers: {
                    $cond: [
                        { $gt: [{ $size: "$answers" }, 0] },
                        {
                            $let: {
                                vars: {
                                    sortedAnswers: {
                                        $filter: {
                                            input: "$answers",
                                            cond: { $eq: ["$$this.upVotes", { $max: "$answers.upVotes" }] },
                                        },
                                    },
                                },
                                in: {
                                    $let: {
                                        vars: {
                                            sortedAnswersByDate: {
                                                $filter: {
                                                    input: "$$sortedAnswers",
                                                    cond: {
                                                        $eq: [
                                                            "$$this.createdAt",
                                                            {
                                                                $max: {
                                                                    $map: {
                                                                        input: "$$sortedAnswers",
                                                                        as: "a",
                                                                        in: { $toDate: "$$a.createdAt" },
                                                                    },
                                                                },
                                                            },
                                                        ],
                                                    },
                                                },
                                            },
                                        },
                                        in: {
                                            $arrayElemAt: ["$$sortedAnswersByDate", 0],
                                        },
                                    },
                                },
                            },
                        },
                        [],
                    ],
                },
            },
        });

        pipeline.push({
            $lookup: {
                from: "answervotes",
                let: { answerId: "$answers._id", userId: user._id },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$answer", "$$answerId"] },
                                    { $eq: ["$postedBy", "$$userId"] },
                                ],
                            },
                        },
                    },
                ],
                as: "userVotes",
            },
        });
          
        pipeline.push({
            $addFields: {
                "answers.isUpvoted": {
                    $cond: [
                        {
                            $gt: [
                                {
                                    $size: {
                                        $filter: {
                                            input: "$userVotes",
                                            cond: {
                                                $and: [
                                                    { $eq: ["$$this.direction", "upVote"] },
                                                    { $eq: ["$$this.vote", 1] },
                                                ],
                                            },
                                        },
                                    },
                                },
                                0,
                            ],
                        },
                        true,
                        false,
                    ],
                },
                "answers.isDownvoted": {
                    $cond: [
                        {
                            $gt: [
                                {
                                    $size: {
                                        $filter: {
                                            input: "$userVotes",
                                            cond: {
                                                $and: [
                                                    { $eq: ["$$this.direction", "downVote"] },
                                                    { $eq: ["$$this.vote", 1] },
                                                ],
                                            },
                                        },
                                    },
                                },
                                0,
                            ],
                        },
                        true,
                        false,
                    ],
                },
            },
        });

        pipeline.push({
            $lookup: {
                from: "forumvotes",
                let: {
                    forumId: "$_id",
                    userId: user._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$forum", "$$forumId"] },
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
                from: "forumvotes",
                let: {
                    forumId: "$_id",
                    userId: user._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$forum", "$$forumId"] },
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
                userVotes: 0,
            },
        });

        pipeline.push({ $sort: { _id: -1 } });

        const result = await Model.aggregate(pipeline);

        return result;
    } catch (error) {
        console.log("error In GETALLFORUM", error);
        return false;
    }
};

export const fetchFilteredForum = async (Model,user,data) => {
    try {
        let pipeline = [];

        const matchObj = {
            department: user.department,
            display: true,
            ...data
        };

        pipeline.push({
            $match: matchObj
        });

        pipeline.push({
            $lookup: {
                from: "answers",
                let: { answerIds: "$answers" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $in: ["$_id", "$$answerIds"] },
                                    { $eq: ["$display", true] },
                                ]
                            },
                        },
                    },
                    {
                        $lookup: {
                            from: "students",
                            localField: "postedBy",
                            foreignField: "_id",
                            as: "postedBy",
                        },
                    },
                    {
                        $addFields: {
                            postedBy: { $arrayElemAt: ["$postedBy", 0] },
                        },
                    },
                ],
                as: "answers",
            },
        });

        pipeline.push({
            $lookup: {
                from: "students",
                localField: "postedBy",
                foreignField: "_id",
                as: "postedBy",
            },
        });

        pipeline.push({
            $lookup: {
                from: "subjects",
                localField: "subject",
                foreignField: "_id",
                as: "subject",
            },
        });

        pipeline.push({
            $addFields: {
                postedBy: { $arrayElemAt: ["$postedBy", 0] },
                subject: { $arrayElemAt: ["$subject", 0] },
                answerCount: { $size: "$answers" },
            },
        });

        pipeline.push({
            $addFields: {
                answers: {
                    $cond: [
                        { $gt: [{ $size: "$answers" }, 0] },
                        {
                            $let: {
                                vars: {
                                    sortedAnswers: {
                                        $filter: {
                                            input: "$answers",
                                            cond: { $eq: ["$$this.upVotes", { $max: "$answers.upVotes" }] },
                                        },
                                    },
                                },
                                in: {
                                    $let: {
                                        vars: {
                                            sortedAnswersByDate: {
                                                $filter: {
                                                    input: "$$sortedAnswers",
                                                    cond: {
                                                        $eq: [
                                                            "$$this.createdAt",
                                                            {
                                                                $max: {
                                                                    $map: {
                                                                        input: "$$sortedAnswers",
                                                                        as: "a",
                                                                        in: { $toDate: "$$a.createdAt" },
                                                                    },
                                                                },
                                                            },
                                                        ],
                                                    },
                                                },
                                            },
                                        },
                                        in: {
                                            $arrayElemAt: ["$$sortedAnswersByDate", 0],
                                        },
                                    },
                                },
                            },
                        },
                        [],
                    ],
                },
            },
        });

        pipeline.push({
            $lookup: {
                from: "answervotes",
                let: { answerId: "$answers._id", userId: user._id },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$answer", "$$answerId"] },
                                    { $eq: ["$postedBy", "$$userId"] },
                                ],
                            },
                        },
                    },
                ],
                as: "userVotes",
            },
        });
          
        pipeline.push({
            $addFields: {
                "answers.isUpvoted": {
                    $cond: [
                        {
                            $gt: [
                                {
                                    $size: {
                                        $filter: {
                                            input: "$userVotes",
                                            cond: {
                                                $and: [
                                                    { $eq: ["$$this.direction", "upVote"] },
                                                    { $eq: ["$$this.vote", 1] },
                                                ],
                                            },
                                        },
                                    },
                                },
                                0,
                            ],
                        },
                        true,
                        false,
                    ],
                },
                "answers.isDownvoted": {
                    $cond: [
                        {
                            $gt: [
                                {
                                    $size: {
                                        $filter: {
                                            input: "$userVotes",
                                            cond: {
                                                $and: [
                                                    { $eq: ["$$this.direction", "downVote"] },
                                                    { $eq: ["$$this.vote", 1] },
                                                ],
                                            },
                                        },
                                    },
                                },
                                0,
                            ],
                        },
                        true,
                        false,
                    ],
                },
            },
        });

        // Add $lookup stage to fetch forumVotes
        pipeline.push({
            $lookup: {
                from: "forumvotes",
                let: {
                    forumId: "$_id",
                    userId: user._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$forum", "$$forumId"] },
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
                from: "forumvotes",
                let: {
                    forumId: "$_id",
                    userId: user._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$forum", "$$forumId"] },
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
                userVotes: 0,
            },
        });

        const result = await Model.aggregate(pipeline);
        return result;
    } catch (error) {
        console.log("error In GETALLFORUM", error);
        return false;
    }
};

export const fetchSingleForumWithAnswer =  async (Model,user,data) => {
    try {
        let pipeline = [];

        pipeline.push({
            $match: {
                $expr: {
                    $eq: ["$_id", ObjectId(data.id)],
                },
            },
        });

        pipeline.push({
            $lookup: {
                from: "answers",
                let: { answerIds: "$answers" },
                pipeline: [
                    {
                        $sort: {
                            createdAt: -1
                        }
                    },
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $in: ["$_id", "$$answerIds"] },
                                    { $eq: ["$display", true] },
                                ]
                            },
                        },
                    },
                    {
                        $lookup: {
                            from: "students",
                            localField: "postedBy",
                            foreignField: "_id",
                            as: "postedBy",
                        },
                    },
                    {
                        $addFields: {
                            postedBy: { $arrayElemAt: ["$postedBy", 0] },
                        },
                    },
                    {
                        $lookup: {
                            from: "answervotes",
                            let: {
                                answerId: "$_id",
                                userId: user._id,
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$answer", "$$answerId"] },
                                                { $eq: ["$postedBy", "$$userId"] },
                                            ],
                                        },
                                    },
                                },
                            ],
                            as: "votes",
                        },
                    },
                    {
                        $addFields: {
                            isUpvoted: {
                                $anyElementTrue: {
                                    $map: {
                                        input: {
                                            $filter: {
                                                input: "$votes",
                                                as: "vote",
                                                cond: {
                                                    $and: [
                                                        { $eq: ["$$vote.direction", "upVote"] },
                                                        { $eq: ["$$vote.vote", 1] },
                                                    ],
                                                },
                                            },
                                        },
                                        as: "filteredVote",
                                        in: true,
                                    },
                                },
                            },
                            isDownvoted: {
                                $anyElementTrue: {
                                    $map: {
                                        input: {
                                            $filter: {
                                                input: "$votes",
                                                as: "vote",
                                                cond: {
                                                    $and: [
                                                        { $eq: ["$$vote.direction", "downVote"] },
                                                        { $eq: ["$$vote.vote", 1] },
                                                    ],
                                                },
                                            },
                                        },
                                        as: "filteredVote",
                                        in: true,
                                    },
                                },
                            },
                        },
                    },
                    {
                        $project: {
                            votes: 0,
                        },
                    },
                ],
                as: "answers",
            },
        });       

        pipeline.push({
            $lookup: {
                from: "students",
                localField: "postedBy",
                foreignField: "_id",
                as: "postedBy",
            },
        });

        pipeline.push({
            $lookup: {
                from: "subjects",
                localField: "subject",
                foreignField: "_id",
                as: "subject",
            },
        });

        pipeline.push({
            $addFields: {
                postedBy: { $arrayElemAt: ["$postedBy", 0] },
                subject: { $arrayElemAt: ["$subject", 0] },
                answerCount: { $size: "$answers" },
            },
        });

        // Add $lookup stage to fetch forumVotes
        pipeline.push({
            $lookup: {
                from: "forumvotes",
                let: {
                    forumId: "$_id",
                    userId: user._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$forum", "$$forumId"] },
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
                from: "forumvotes",
                let: {
                    forumId: "$_id",
                    userId: user._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$forum", "$$forumId"] },
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
        console.log(result,'result');

        return result;
    } catch (error) {
        console.log("error In GETSINGLEFORUM", error);
        return false;
    }
}