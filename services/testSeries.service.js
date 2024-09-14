var ObjectId = require("mongodb").ObjectID;

export const getFullLengthTestSeries = async (Model,data) => {
	try{
		let pipeline = [];
		
		// adding query into the pipeline array
        pipeline.push({
			$match: {
            	$expr: {
					$and: [
						{
							$eq: ['$department', data.department.valueOf()]
						},
						{
							$eq: ['$exam', data.exam.valueOf()]
						},
                        {
							$eq: ['$mode', "full"]
                        },
						{
							$eq: [ "$display", true ]
						}
					] 
                }
			},
		});

		pipeline.push({
			$project: {
				'display': 1, 
				'lock': 1, 
				'publish': 1, 
				'name': 1, 
				'department': 1,
				'exam': 1,
                'time': 1,
                'marks': 1,
                'releaseDate': 1,
                'totalQuestions': { $sum: { $map: { input: '$sections', as: 'section', in: { $size: '$$section.questions' } } } }
			}
		})

        pipeline.push({ $sort: { releaseDate: 1 } });
		
		const result = await Model.aggregate(pipeline);
		console.log(result,"resultData");
		return result;
	}catch(error){
		console.log('error In FINDFULLLENGTHTESTSERIES ', error);
		return false;
	}
}

export const getSubjectWiseTestSeries = async (Model,data) => {
	try{
		let pipeline = [];
		
		// adding query into the pipeline array
        pipeline.push({
			$match: {
            	$expr: {
					$and: [
						{
							$eq: ['$department', data.department.valueOf()]
						},
						{
							$eq: ['$exam', data.exam.valueOf()]
						},
                        {
							$eq: ['$mode', "subject"]
                        },
						{
							$eq: [ "$display", true ]
						}
					] 
                }
			},
		});

		pipeline.push({
			$project: {
				'display': 1, 
				'lock': 1, 
				'publish': 1, 
				'name': 1, 
				'department': 1,
				'exam': 1,
                'time': 1,
                'marks': 1,
                'releaseDate': 1,
                'totalQuestions': { $sum: { $map: { input: '$sections', as: 'section', in: { $size: '$$section.questions' } } } }
			}
		})

        pipeline.push({ $sort: { releaseDate: 1 } });
		
		const result = await Model.aggregate(pipeline);
		console.log(result,"resultData");
		return result;
	}catch(error){
		console.log('error In FINDSUBJECTWISETESTSERIES ', error);
		return false;
	}
}

export const getSubjectList = async (Model,data) => {
	try{
		let pipeline = [];
		
		// adding query into the pipeline array
        pipeline.push({
			$match: {
            	$expr: {
					$and: [
						{
							$eq: ['$department', data.department.valueOf()]
						},
						{
							$eq: ['$exam', data.exam.valueOf()]
						},
                        {
							$eq: ['$mode', "subject"]
                        },
						{
							$eq: [ "$display", true ]
						}
					] 
                }
			},
		});

		// Group by subjectId and accumulate distinct subjectIds
		pipeline.push({
			$group: {
				_id: '$subjects',
				subjectIds: { $addToSet: '$subjectId' }
			}
		});
	  
		// Lookup subjects collection to fetch subject details
		pipeline.push({
			$lookup: {
				from: 'subjects', // Replace with the actual collection name
				localField: '_id',
				foreignField: '_id',
				as: 'subjectDetails'
			}
		});
	  
		// Unwind the subjectDetails array
		pipeline.push({
			$unwind: '$subjectDetails'
		});
	  
		// Project the final result with subject details
		pipeline.push({
			$replaceRoot: {
				newRoot: '$subjectDetails'
			}
		});  
		
		const result = await Model.aggregate(pipeline);
		console.log(result,"resultData");
		return result;
	}catch(error){
		console.log('error In FINDSUBJECTWISETESTSERIES ', error);
		return false;
	}
}

export const getFilteredSubject = async (Model,user,data) => {
	try{
		let pipeline = [];
		
		// adding query into the pipeline array
        pipeline.push({
			$match: {
            	$expr: {
					$and: [
						{
							$eq: ['$department', user.department.valueOf()]
						},
						{
							$eq: ['$exam', user.exam.valueOf()]
						},
                        {
							$eq: ['$mode', "subject"]
                        },
						{
							$eq: [ "$display", true ]
						},
						{
							$in: [ObjectId(data.id), '$subjects']
						}
					] 
                }
			},
		});

        pipeline.push({ $sort: { releaseDate: 1 } });
		
		const result = await Model.aggregate(pipeline);
		console.log(result,"resultData");
		return result;
	}catch(error){
		console.log('error In FINDSUBJECTWISETESTSERIES ', error);
		return false;
	}
}