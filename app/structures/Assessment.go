package structures

type Assessment struct {
	Id 					int64 		`json:"id,string" sql:"id"`
	DateTime			string		`json:"dateTime" sql:"date_time" sql_ins:"date_time"`
	EmployeeList		[]int64		`json:"employeeList"`
}

type AssessmentEmployee struct {
	Id					int64
	AssessmentId		int64
	EmployeeId			int64
}