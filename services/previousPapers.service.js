import { facetHelper } from "../helpers/paginationHelper";
var ObjectId = require("mongodb").ObjectID;

export const getAllPapersForStudent = async (Model,data) => {
	try{
		let pipeline = [];
		
		// adding query into the pipeline array
        pipeline.push({
			$match: {
            	$expr: {
					$and: [
						{
							$eq: ['$department', data.department]
						},
						{
							$eq: ['$exam', data.exam]
						},
						{
							$eq: [ "$display", true ]
						}
					] 
                }
			},
		});

		pipeline.push({
            $lookup: {
                from: "departments",
                localField: "department",
                foreignField: "_id",
				pipeline: [
					{
						$project: {
							'code': 1, 
							'title': 1,
						}
					}
				],
                as: "department"
            }
        });

		pipeline.push({
            $lookup: {
                from: "exams",
                localField: "exam",
                foreignField: "_id",
				pipeline: [
					{
						$project: {
							'code': 1, 
							'title': 1,
						}
					}
				],
                as: "exam"
            }
        });

		pipeline.push({
			$addFields: {
				department: { $arrayElemAt: ["$department", 0] },
				exam: { $arrayElemAt: ["$exam", 0] }
			}
		});

		pipeline.push({
			$project: {
				'instructions': 1, 
				'display': 1, 
				'lock': 1, 
				'publish': 1, 
				'name': 1, 
				'department': 1,
				'exam': 1
			}
		})

        pipeline.push({ $sort: { _id: 1 } });
		
		const result = await Model.aggregate(pipeline);
		console.log(result,"resultData");

		// Reverse the data using reverse() method
		// const reversedResult = result.reverse();

		return result;
	}catch(error){
		console.log('error In FINDPAPERSFORSTUDENT ', error);
		return false;
	}
}

export const getSubjectWisePapersForStudent = async (Model,data) => {
	try{
		let pipeline = [];
		
		// adding query into the pipeline array
		pipeline.push({
			$match: {
				$expr: {
					$eq: ["$_id", data.department],
				},
			},
		});
		  
		pipeline.push({
			$lookup: {
				from: "subjects",
				localField: "subjects",
				foreignField: "_id",
				as: "subjects",
				pipeline: [
					{
						$match: {
							display: true
						}
					},
					{
						$sort: {
							_id: 1
						},
					},
				]
			},
		});
		
		pipeline.push({
			$unwind: "$subjects",
		});
		
		pipeline.push({
			$lookup: {
				from: "questions",
				let: { subjectId: "$subjects._id" },
				pipeline: [
					{
						$match: {
							$expr: {
								$and: [
									{ $eq: ["$department", data.department] },
									{ $eq: ["$exam", data.exam] },
									{ $eq: ["$subject", "$$subjectId"] },
								],
							},
						},
					},
					{
						$group: {
							_id: null,
							totalQues: { $sum: 1 }, // Assuming you want to count the number of questions
							oldestYear: { $min: "$year" },
							newestYear: { $max: "$year" },
						},
					},
				],
				as: "questions",
			},
		});
		  
		pipeline.push({
			$addFields: {
				"subjects.totalQues": {
					$ifNull: [{ $arrayElemAt: ["$questions.totalQues", 0] }, 0],
				},
				"subjects.yearRange": {
					$let: {
						vars: {
							questionData: { $arrayElemAt: ["$questions", 0] },
						},
						in: {
							from: "$$questionData.oldestYear",
							to: "$$questionData.newestYear",
						},
					},
				},
			},
		});
		  
		pipeline.push({
			$group: {
				_id: "$_id",
				exams: { $first: "$exams" },
				subjects: { $push: "$subjects" },
				code: { $first: "$code" },
				title: { $first: "$title" },
				__v: { $first: "$__v" },
				display: { $first: "$display" },
				yearRange: { $first: "$yearRange" },
			},
		});
		  
		pipeline.push({
			$project: {
				_id: 1,
				exams: 1,
				subjects: {
					_id: 1,
					code: 1,
					title: 1,
					lock: 1,
					totalQues: 1,
					yearRange: 1,
				},
				code: 1,
				title: 1,
				__v: 1,
				display: 1,
				yearRange: 1,
			},
		});
		
		const result = await Model.aggregate(pipeline);
		console.log(result,"resultData");
		return result;
	}catch(error){
		console.log('error In FINDPAPERSFORSTUDENT ', error);
		return false;
	}
}

export const getSubjectWiseQuestionsForStudent = async (Model,user,data) => {
	try{
		let pipeline = [];
		
		// adding query into the pipeline array
        pipeline.push({
			$match: {
                $expr: {
                    $and: [
                        {
                            $eq: ['$department', ObjectId(user.department)]
                        },
                        {
                            $eq: [ "$exam", ObjectId(user.exam) ],
                        },
                        {
                            $eq: [ "$subject", ObjectId(data.id) ],
                        },
						{
                            $eq: [ "$year", data.year ],
                        }
                    ]
                }
            },
		});
		
		const result = await Model.aggregate(pipeline);
		console.log(result,"resultData");
		return result;
	}catch(error){
		console.log('error In FINDSUBJECTWISEQUESTIONS ', error);
		return false;
	}
};

export const getYearWiseSubjectQuesForStudent = async (Model, user, data) => {
	try {
		let pipeline = [];

		// Adding query into the pipeline array
		pipeline.push({
			$match: {
				$expr: {
					$and: [
						{
							$eq: ['$exam', ObjectId(user.exam)],
						},
						{
							$eq: ['$subject', ObjectId(data.id)],
						},
						{
							$gte: ['$year', 1970],
						},
					],
				},
			},
		});

		// Grouping by year and adding questions to an array
		pipeline.push({
			$group: {
				_id: '$year',
				questions: {
					$push: '$$ROOT',
				},
			},
		});

		// Transforming _id to year
		pipeline.push({
			$project: {
				year: '$_id',
				questions: 1,
				_id: 0,
			},
		});

		// Add logic to sort questions based on marking rule
		pipeline.push({
			$addFields: {
				questions: {
					$map: {
						input: '$questions',
						as: 'question',
						in: {
							$mergeObjects: [
								'$$question',
								{
									__sortKey: {
										$cond: {
											if: { $eq: ['$$question.markingRule.positive', '1'] },
											then: 1,
											else: {
												$cond: {
													if: { $eq: ['$$question.markingRule.positive', '2'] },
													then: 2,
													else: {
														$cond: {
															if: { $eq: ['$$question.markingRule.positive', '3'] },
															then: 3,
															else: 0,
														},
													},
												},
											},
										},
									},
								},
							],
						},
					},
				},
			},
		});

		// Sort questions based on marking rule
		pipeline.push({
			$unwind: '$questions',
		});

		pipeline.push({
			$sort: {
				'questions.__sortKey': 1, // Sort in ascending order of marking rule value
			},
		});

		// Sort by year in descending order
		pipeline.push({
			$sort: {
				year: -1,
			},
		});

		// Lookup into the department collection to get department information
		pipeline.push({
			$lookup: {
				from: 'departments', // Replace 'departments' with the actual name of the department collection
				localField: 'questions.department',
				foreignField: '_id',
				as: 'questions.department',
			},
		});

		pipeline.push({
			$unwind: '$questions.department',
		});

		pipeline.push({
			$group: {
				_id: '$year',
				questions: {
					$push: '$questions',
				},
			},
		});

		// Rename _id to year
		pipeline.push({
			$project: {
				year: '$_id',
				questions: 1,
				_id: 0,
			},
		});

		// Executing the aggregation query
		const result = await Model.aggregate(pipeline);
		console.log(result, 'resultData');
		return result;
	} catch (error) {
		console.log('error In FINDSUBJECTWISEQUESTIONS ', error);
		return false;
	}
};