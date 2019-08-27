SELECT id, datetime FROM assessment RIGHT JOIN 
	(SELECT assessment AS asst 
	 FROM candidate_for_assessment 
	 WHERE candidate = 3) AS tbb 
	 ON assessment.id = tbb.asst;