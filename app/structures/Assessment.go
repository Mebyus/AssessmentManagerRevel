package structures

import (
	"strings"
)

type Assessment struct {
	Id 					int64 							`json:"id,string" sql:"id"`
	DateTime			string							`json:"dateTime" sql:"date_time" sql_ins:"date_time"`
	EmployeeList		[]*AssessmentEmployee			`json:"employeeList"`
	CandidateList		[]*CandidateForAssessment		`json:"candidateList"`
}

func (assessment *Assessment) HasEmployees() (bool) {
	return len(assessment.EmployeeList) != 0
}

func (assessment *Assessment) HasCandidates() (bool) {
	return len(assessment.CandidateList) != 0
}

// Assessment.SetNewId метод задает новое значение id собеседования как в самом объекте,
// так и в списках связей с сотрудниками AssessmentList и кандидатами CandidateList
func (assessment *Assessment) SetNewId(id int64) {
	assessment.Id = id
	for _, v := range assessment.EmployeeList {
		v.AssessmentId = id
	}
	for _, v := range assessment.CandidateList {
		v.AssessmentId = id
	}
}

// Assessment.CandidateListStr метод возвращает строку -- список
// представлений связей кандидат-собеседование, для данного собеседования.
// Используется для формирования SQL-запроса INSERT.
func (assessment *Assessment) CandidateListStr() (string) {
	strList := []string{}
	for i := range assessment.CandidateList {
		strList = append(strList, assessment.CandidateList[i].StrRow())
	}
	return strings.Join(strList, ", ")
}

// Assessment.EmployeeListStr метод возвращает строку -- список
// представлений связей сотрудник-собеседование, для данного собеседования.
// Используется для формирования SQL-запроса INSERT.
func (assessment *Assessment) EmployeeListStr() (string) {
	strList := []string{}
	for i := range assessment.EmployeeList {
		strList = append(strList, assessment.EmployeeList[i].StrRow())
	}
	return strings.Join(strList, ", ")
}
