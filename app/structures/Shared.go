package structures

import (
	"fmt"
)

// Структура для хранения связи сотрудник-собеседование
type AssessmentEmployee struct {
	Id					int64		`json:"id"`
	AssessmentId		int64		`json:"assessmentId"`
	EmployeeId			int64		`json:"employeeId"`
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
}

// CandidateForAssessment.StrRow метод возвращает представление связи кандидат-собеседование
// в виде строки формата "(field_1, field_2, field_3)". Используется для
// формирования SQL-запроса INSERT.
func (candidate *CandidateForAssessment) StrRow() (string) {
	return fmt.Sprintf("(%d, %d, %s, %d, '%s')", candidate.AssessmentId, candidate.CandidateId,
		candidate.IsConfirmed, candidate.Result, candidate.Comment)
}

// AssessmentEmployee.StrRow метод возвращает представление связи сотрудник-собеседование
// в виде строки формата "(field_1, field_2, field_3)". Используется для
// формирования SQL-запроса INSERT.
func (employee *AssessmentEmployee) StrRow() (string) {
	return fmt.Sprintf("(%d, %d)", employee.AssessmentId, employee.EmployeeId)
}
