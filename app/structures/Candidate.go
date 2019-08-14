package structures

import "strings"

type Candidate struct {
	Id 					int64 		`json:"id,string" sql:"id"`
	FirstName			string		`json:"firstName" sql:"first_name" sql_ins:"first_name"`
	MiddleName			string		`json:"middleName" sql:"middle_name" sql_ins:"middle_name"`
	LastName			string		`json:"lastName" sql:"last_name" sql_ins:"last_name"`
	BirthDate			string		`json:"birthDate" sql:"birth_date" sql_ins:"birth_date"`
	Phone				string		`json:"phone" sql:"phone" sql_ins:"phone"`
	Email				string		`json:"email" sql:"email" sql_ins:"email"`
	AssessmentList		[]*CandidateForAssessment		`json:"assessmentList"`
}

func (candidate *Candidate) HasAssessments() (bool) {
	if len(candidate.AssessmentList) == 0 {
		return false
	} else {
		return true
	}
}

// Candidate.SetNewId метод задает новое значение id кандидата как в самом объекте,
// так и в списке связей с собеседованиями AssessmentList
func (candidate *Candidate) SetNewId(id int64) {
	candidate.Id = id
	for _, v := range candidate.AssessmentList {
		v.CandidateId = id
	}
}

// Candidate.AssessmentListStr метод возвращает строку -- список
// представлений связей кандидат-собеседование, для данного кандидата.
// Используется для формирования SQL-запроса INSERT.
func (candidate *Candidate) AssessmentListStr() (string) {
	strList := []string{}
	for i := range candidate.AssessmentList {
		strList = append(strList, candidate.AssessmentList[i].StrRow())
	}
	return strings.Join(strList, ", ")
}
