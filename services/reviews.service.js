export const fetchRandomReviews = async (Model) => {
	try{
		let pipeline = [];
		
		// adding query into the pipeline array
		pipeline.push({
			$sample: {
				size: 3
			}
		});
		
		// Unwind the reviews array to flatten it in each document
		pipeline.push({
			$unwind: "$reviews"
		});

		// Group all reviews into a single array
		pipeline.push({
			$group: {
				_id: null,
				reviews: {
					$push: "$reviews"
				}
			}
		});

		pipeline.push({
            $unwind: "$reviews"
        });
          
        pipeline.push({
            $replaceRoot: {
                newRoot: "$reviews"
            }
        });

		const result = await Model.aggregate(pipeline);
		console.log(result,"resultData");
		return result;
	}catch(error){
		console.log('error In FINDRANDOMREVIEWS ', error);
		return false;
	}
}