var ObjectId = require("mongodb").ObjectID;

export const fetchFilteredBookmarks = async (Model, user) => {
	try {
		let pipeline = [];

		// Adding query into the pipeline array
		pipeline.push({
			$match: {
				$expr: {
					$eq: ['$postedBy', user._id],
				},
			},
		});

		// Adding the $unwind stage to the pipeline
		pipeline.push({
			$unwind: '$questions',
		});

		// Adding the $lookup stage to retrieve the actual questions
		pipeline.push({
			$lookup: {
				from: 'questions',
				localField: 'questions.question_id',
				foreignField: '_id',
				as: 'questionsData',
			},
		});

		// Adding the $lookup stage to retrieve the subject details
		pipeline.push({
			$lookup: {
				from: 'subjects',
				localField: 'questions.subjectId',
				foreignField: '_id',
				as: 'subjectData',
			},
		});

		// Grouping by subject and adding questions to an array
		pipeline.push({
			$group: {
				_id: '$questions.subjectId',
				questions: {
					$push: {
						$mergeObjects: [
							{
								$arrayElemAt: ['$questionsData', 0],
							},
							{
								type: '$questions.type',
								test_series_id: '$questions.test_series_id',
								previous_paper_id: '$questions.previous_paper_id',
							},
						],
					},
				},
				subject: {
					$first: {
						$arrayElemAt: ['$subjectData', 0],
					},
				},
			},
		});

		// Exclude unnecessary fields
		pipeline.push({
			$project: {
				_id: 0,
				'subject._id': 1,
				'subject.departments': 1,
				'subject.chapters': 1,
				'subject.code': 1,
				'subject.title': 1,
				'subject.__v': 1,
				'subject.lock': 1,
				'subject.display': 1,
				questions: 1,
			},
		});

		const result = await Model.aggregate(pipeline);
		return result;
	}catch (error) {
		console.log('error In fetchFilteredBookmarks ', error);
		return false;
	}
};