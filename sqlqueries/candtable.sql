CREATE TABLE candidate (
	id			serial	primary key,
	lastname	varchar(250),
	firstname	varchar(250),
	middlename	varchar(250),
	birthdate	date,
	email		varchar(250),
	phone		varchar(250)
);