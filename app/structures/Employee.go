package structures

import "strings"

type Employee struct {
	Id 					int64 						`json:"id,string" sql:"id"`
	FirstName			string						`json:"firstName" sql:"first_name" sql_ins:"first_name"`
	MiddleName			string						`json:"middleName" sql:"middle_name" sql_ins:"middle_name"`
	LastName			string						`json:"lastName" sql:"last_name" sql_ins:"last_name"`
	AssessmentList		[]*AssessmentEmployee
}

// Employee.SetNewId метод задает новое значение id сотрудника как в самом объекте,
// так и в списке связей с собеседованиями AssessmentList
func (employee *Employee) SetNewId(id int64) {
	employee.Id = id
	for _, v := range employee.AssessmentList {
		v.EmployeeId = id
	}
}

// Employee.AssessmentListStr метод возвращает строку -- список
// представлений связей сотрудник-собеседование, для данного сотрудника.
// Используется для формирования SQL-запроса INSERT.
func (employee *Employee) AssessmentListStr() (string) {
	strList := []string{}
	for i := range employee.AssessmentList {
		strList = append(strList, employee.AssessmentList[i].StrRow())
	}
	return strings.Join(strList, ", ")
}
