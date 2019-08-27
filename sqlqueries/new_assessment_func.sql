CREATE OR REPLACE FUNCTION new_assessment(dt timestamp)
RETURNS integer AS $$
DECLARE
	a_id integer;
BEGIN
	-- creates new assessment and stores its id into a_id
	INSERT INTO assessment(date_time)
	VALUES (dt) RETURNING id INTO a_id;
	
	-- 
	INSERT INTO assessment_employee(assessment, employee)
	VALUES (a_id, 20);
	
	RETURN a_id;
END; $$
LANGUAGE PLPGSQL;

-- INSERT INTO assessment_employee (assessment, employee)
-- VALUES 
-- 	(10, 3),
-- 	(10, 2);