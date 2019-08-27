CREATE TABLE user_data (
	id					serial	primary key,
	name				varchar(255),
	username			varchar(255) NOT NULL,
	hashed_password		varchar(255) NOT NULL
);