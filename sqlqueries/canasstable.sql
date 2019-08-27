CREATE TABLE candidate_for_assessment (
	id				serial			primary key,
	assessment		int				references assessment(id),
	candidate		int				references candidate(id),
	is_confirmed	bool			null,
	result			int				not null,
	comment			varchar(250) 	not null
);