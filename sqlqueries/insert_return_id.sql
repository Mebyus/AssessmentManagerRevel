INSERT INTO employee (last_name, first_name, middle_name) 
VALUES ('Smith', 'John', 'Bobby') RETURNING id, last_name;