var ObjectId = require("mongodb").ObjectID;

export const fetchExamDepartments = async (Model,data) => {
	try{
		let pipeline = [];
		
		// adding query into the pipeline array
        pipeline.push({
			$match: {
            	$expr: {    
                    $eq: [ "$_id", ObjectId(data.id) ],
                }
			},
		});

        pipeline.push({
			$lookup: {
				from: "departments",
				let: { departmentIds: "$departments" },
				pipeline: [
					{
						$match: {
							$expr: {
								$and: [
									{ $in: ["$_id", "$$departmentIds"] },
									{ $eq: ["$display", true] }
								]
							}
						}
					},
					{
						$sort: { _id: 1 }
					}
				],
				as: "departments"
			}
		});
		
		const result = await Model.aggregate(pipeline);
		return result;
	}catch(error){
		console.log('error In FINDEXAMWISEDEPT ', error);
		return false;
	}
}

export const fetchAllDepartments = async(Model) => {
	try{
		let pipeline = [];
		
		// adding query into the pipeline array
        pipeline.push({
			$match: {
            	$expr: {    
                    $eq: [ "$display", true ],
                }
			},
		});

        pipeline.push({
            $project: {
				'title': 1, 
				'code': 1,
				'display': 1
			}
        });

		// ascending order by title
		pipeline.push({
            $sort: {
				'title': 1
			}
        });
		
		const result = await Model.aggregate(pipeline);
		return result;
	}catch(error){
		console.log('error In ALLDEPT ', error);
		return false;
	}
}