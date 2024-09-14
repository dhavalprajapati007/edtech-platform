var ObjectId = require("mongodb").ObjectID;

export const getPreviousYearPaperPayment = async (Model,data) => {
	try{
		let pipeline = [];
		
		// adding query into the pipeline array
        pipeline.push({
			$match: {
            	$expr: {
					$and: [
                        // {
                        //     $or: [
                        //         { '$mode': "previous-paper-1-year" },
                        //         { '$mode': "previous-paper-2-year" }
                        //     ]
                        // },
						{
							$ne: [ '$mode', "test-series" ]
						},
						{
							$eq: [ '$department', data.department ]
						},
						{
							$eq: [ '$exam', data.exam ]
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
            $unwind: "$department"
        });

		const result = await Model.aggregate(pipeline);
		console.log(result,"resultData");
		return result;
	}catch(error){
		console.log('error In GETPREVIOUSYEARPAYMENT ', error);
		return false;
	}
}

export const fetchTestSeriesPayment = async (Model,data) => {
	try{
		let pipeline = [];
		
		// adding query into the pipeline array
        pipeline.push({
			$match: {
            	$expr: {
					$and: [
						{
							$eq: [ '$mode', "test-series" ]
						},
						{
							$eq: [ '$department', data.department ]
						},
						{
							$eq: [ '$exam', data.exam ]
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
            $unwind: "$department"
        });

		const result = await Model.aggregate(pipeline);
		console.log(result,"resultData");
		return result;
	}catch(error){
		console.log('error In GETPREVIOUSYEARPAYMENT ', error);
		return false;
	}
}

export const getAllPayment = async (Model,data) => {
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
            $unwind: "$department"
        });
        
		const result = await Model.aggregate(pipeline);
		console.log(result,"resultData");
		return result;
	}catch(error){
		console.log('error In GETALLPAYMENT ', error);
		return false;
	}
}

export const getDepWisePayment = async (Model,data) => {
	try{
		let pipeline = [];
		console.log(data.id);
		// adding query into the pipeline array
        pipeline.push({
			$match: {
            	$expr: {
					$and: [
						{
							$eq: ['$department', ObjectId(data.id)]
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
            $unwind: "$department"
        });
        
		const result = await Model.aggregate(pipeline);
		console.log(result,"resultData");
		return result;
	}catch(error){
		console.log('error In GETALLPAYMENT ', error);
		return false;
	}
}