package structures

type Employee struct {
	Id 					int64 		`json:"id,string" sql:"id"`
	FirstName			string		`json:"firstName" sql:"first_name" sql_ins:"first_name"`
	MiddleName			string		`json:"middleName" sql:"middle_name" sql_ins:"middle_name"`
	LastName			string		`json:"lastName" sql:"last_name" sql_ins:"last_name"`
}
