INSERT INTO assessment_employee(assessment, employee)
VALUES
	(13, 10), (13, 9), (13, 11)
ON CONFLICT DO NOTHING;