package structures

type AssessmentDate struct {
	Id			int64
	Date		string
}

type Candidate struct {
	Id 					int64 		`json:"id,string" sql:"id"`
	FirstName			string		`json:"firstName" sql:"first_name" sql_ins:"first_name"`
	MiddleName			string		`json:"middleName" sql:"middle_name" sql_ins:"middle_name"`
	LastName			string		`json:"lastName" sql:"last_name" sql_ins:"last_name"`
	BirthDate			string		`json:"birthDate" sql:"birth_date" sql_ins:"birth_date"`
	Phone				string		`json:"phone" sql:"phone" sql_ins:"phone"`
	Email				string		`json:"email" sql:"email" sql_ins:"email"`
}