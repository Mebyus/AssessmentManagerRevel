package structures

import (
	"fmt"
	"regexp"
)

// Структура для хранения связи сотрудник-собеседование
type AssessmentEmployee struct {
	Id					int64		`json:"id"`
	AssessmentId		int64		`json:"assessmentId"`
	DateTime			string		`json:"dateTime"`
	EmployeeId			int64		`json:"employeeId"`
	LastName			string		`json:"lastName"`
	FirstName			string		`json:"firstName"`
}

// Структура для хранения связи кандидат-собеседование и результатов кандидата
// на этом собеседовании
type CandidateForAssessment struct {
	Id					int64		`json:"id"`
	AssessmentId		int64		`json:"assessmentId"`
	DateTime			string		`json:"dateTime"`
	CandidateId			int64		`json:"candidateId"`
	IsConfirmed			string		`json:"isConfirmed"`
	Result				int			`json:"result"`
	Comment				string		`json:"comment"`
	LastName			string		`json:"lastName"`
	FirstName			string		`json:"firstName"`
}

var escapeSQLRegex = regexp.MustCompile("[\"'\\\\%_`]")

func escapeSQL(str string) (string) {
	return "E'" + escapeSQLRegex.ReplaceAllStringFunc(str, func(char string) string {
		return "\\" + char
	}) + "'"
}

// CandidateForAssessment.StrRow метод возвращает представление связи кандидат-собеседование
// в виде строки формата "(field_1, field_2, field_3)". Используется для
// формирования SQL-запроса INSERT.
func (candidate *CandidateForAssessment) StrRow() (string) {
	return fmt.Sprintf("(%d, %d, %s, %d, %s)", candidate.AssessmentId, candidate.CandidateId,
		candidate.IsConfirmed, candidate.Result, escapeSQL(candidate.Comment))
}

// AssessmentEmployee.StrRow метод возвращает представление связи сотрудник-собеседование
// в виде строки формата "(field_1, field_2, field_3)". Используется для
// формирования SQL-запроса INSERT.
func (employee *AssessmentEmployee) StrRow() (string) {
	return fmt.Sprintf("(%d, %d)", employee.AssessmentId, employee.EmployeeId)
}
