package mappers

import (
	"AssessmentManager/app/structures"
	"database/sql"
	"errors"
	"fmt"
	"strconv"
)

// Маппер оформляющий и передающий запросы в БД.
type CandidateMapper struct {
	Mapper
}

func (mapper *CandidateMapper) Search(searchStr string) (*[]structures.Candidate, error) {
	candidates := []structures.Candidate{}
	columnString, _ := tagString("sql", structures.Candidate{})
	query := "SELECT " + columnString +
		" FROM candidate WHERE last_name ILIKE $1 || '%' OR " +
		"first_name ILIKE $1 || '%' OR " +
		"middle_name ILIKE $1 || '%';";

	rows, err := mapper.connection.Query(query, searchStr)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		candidate := structures.Candidate{}
		err = rows.Scan(tagPtr("sql", &candidate)...)

		if err != nil {
			defer func() {
				closeErr := rows.Close()
				if closeErr != nil {
					fmt.Println(closeErr)
				}
			}()
			return nil, err
		}
		candidates = append(candidates, candidate)
	}
	return &candidates, nil
}

// CandidateMapper.Get метод оформляет и передает запрос
// GET /candidate на получение списка всех кандидатов в БД.
func (mapper *CandidateMapper) Get() (*[]structures.Candidate, error) {
	candidates := []structures.Candidate{}
	columnString, _ := tagString("sql", structures.Candidate{})
	query := "SELECT " + columnString +
		" FROM candidate"

	rows, err := mapper.connection.Query(query)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		candidate := structures.Candidate{}
		err = rows.Scan(tagPtr("sql", &candidate)...)

		if err != nil {
			defer func() {
				closeErr := rows.Close()
				if closeErr != nil {
					fmt.Println(closeErr)
				}
			}()
			return nil, err
		}
		candidates = append(candidates, candidate)
	}
	return &candidates, nil
}


// CandidateMapper.GetById метод оформляет и передает запрос
// GET /candidate/:id на получение кандидата по заданному id в БД.
func (mapper *CandidateMapper) GetById(id string) (*structures.Candidate, error) {
	candidate := structures.Candidate{}

	// Запрашиваем основную информацию о кандидате
	columnString, _ := tagString("sql", candidate)
	query := "SELECT " + columnString +
				" FROM candidate WHERE id = $1"
	rows, err := mapper.connection.Query(query, id)
	if err != nil {
		return nil, err
	}
	if rows.Next() {
		err = rows.Scan(tagPtr("sql", &candidate)...)

		if err != nil {
			defer func() {
				closeErr := rows.Close()
				if closeErr != nil {
					fmt.Println(closeErr)
				}
			}()
			return nil, err
		}
	}
	if rows.Next() {
		return nil, errors.New("Unexpected query result.")
	}

	// Запрашиваем информацию о собеседованиях, в которых принимает участие
	// кандидат
	query = "SELECT a.assessment, b.date_time, a.candidate, a.is_confirmed, a.result, a.comment " +
			"FROM (SELECT * FROM candidate_for_assessment WHERE candidate = $1) as a " +
			"LEFT JOIN assessment as b ON a.assessment = b.id;"
	assessmentRows, err := mapper.connection.Query(query, id)
	if err != nil {
		return nil, err
	}
	for assessmentRows.Next() {
		isConfirmed := sql.NullBool{}
		assessment := structures.CandidateForAssessment{}
		err = assessmentRows.Scan(&assessment.AssessmentId, &assessment.DateTime, &assessment.CandidateId,
			&isConfirmed, &assessment.Result, &assessment.Comment)

		if isConfirmed.Valid {
			assessment.IsConfirmed = fmt.Sprintf("%t", isConfirmed.Bool)
		} else {
			assessment.IsConfirmed = "null"
		}

		if err != nil {
			defer func() {
				closeErr := assessmentRows.Close()
				if closeErr != nil {
					fmt.Println(closeErr)
				}
			}()
			return nil, err
		}
		candidate.AssessmentList = append(candidate.AssessmentList, &assessment)
	}

	return &candidate, nil
}

// CandidateMapper.Create метод оформляет и передает запрос
// PUT /candidate/:id на создание записи кандидата в БД.
func (mapper *CandidateMapper) Create(candidate *structures.Candidate) (*structures.Candidate, error) {
	var newId int64
	var strId string

	// Делаем запрос на добавление в БД основной информации о кандидате
	columnString, columnNum := tagString("sql_ins", *candidate)
	query := "INSERT INTO candidate (" + columnString +
		") VALUES " + substStr(columnNum, "$") + " RETURNING id;"
	row := mapper.connection.QueryRow(query, candidate.FirstName,
		candidate.MiddleName, candidate.LastName, candidate.BirthDate,
		candidate.Phone, candidate.Email)

	// Получаем id выданное БД новому кандидату
	err := row.Scan(&newId)
	if err != nil {
		return nil, fmt.Errorf("Добавление в БД:\n", err)
	}
	candidate.SetNewId(newId)
	strId = strconv.FormatInt(newId, 10)

	// Добавляем в таблицу связей

	err = mapper.CreateCandidateAssessment(strId, candidate)
	if err != nil {
		return nil, fmt.Errorf("Создание списка собеседований для кандидата в БД:\n", err)
	}

	return candidate, nil
}

// CandidateMapper.CreateCandidateAssessment вспомогательный метод запросов PUT и POST,
// предназначен для создания связей кандидата и собеседований.
func (mapper *CandidateMapper) CreateCandidateAssessment(candidateId string, candidate *structures.Candidate) (error) {
	if candidate.HasAssessments() {
		query := "INSERT INTO candidate_for_assessment(assessment, candidate, is_confirmed, result, comment) VALUES " +
			candidate.AssessmentListStr() +
			" ON CONFLICT DO NOTHING;"
		_, err := mapper.connection.Exec(query)
		if err != nil {
			return fmt.Errorf("Добавление списка собеседований кандидата %s в БД:", candidateId, err)
		}
	}

	return nil
}

// CandidateMapper.AlterCandidateAssessment вспомогательный метод запроса POST,
// предназначен для модификации таблицы связей кандидата и собеседований.
func (mapper *CandidateMapper) AlterCandidateAssessment(candidateId string, candidate *structures.Candidate) (error) {
	// Делаем запрос на удаление старых связей кандидата
	query := "DELETE FROM candidate_for_assessment WHERE candidate = $1"
	_, err := mapper.connection.Exec(query, candidateId)
	if err != nil {
		return fmt.Errorf("Удаление списка собеседований кандидата %s в БД:", candidateId, err)
	}

	// Делаем запрос на добавление обновленных связей
	err = mapper.CreateCandidateAssessment(candidateId, candidate)
	if err != nil {
		return err
	}

	return nil
}

// CandidateMapper.Update метод оформляет и передает запрос
// POST /candidate/:id на изменение записи кандидата в БД.
func (mapper *CandidateMapper) Update(candidate *structures.Candidate) (*structures.Candidate, error) {
	strId := strconv.FormatInt(candidate.Id, 10)

	setString, columnNum := tagSubstStr("sql_ins", *candidate)
	query := "UPDATE candidate SET " +
		setString +
		"WHERE id = $" + strconv.Itoa(columnNum + 1)

	_, err := mapper.connection.Exec(query, candidate.FirstName,
		candidate.MiddleName, candidate.LastName, candidate.BirthDate,
		candidate.Phone, candidate.Email, candidate.Id)

	if err != nil {
		return nil, fmt.Errorf("Обновление кандидата в БД:", err)
	}

	err = mapper.AlterCandidateAssessment(strId, candidate)

	return candidate, nil
}

// CandidateMapper.Delete метод оформляет и передает запрос
// DELETE /candidate/:id на удаление записи кандидата по id в БД.
func (mapper *CandidateMapper) Delete(id string) (error) {
	query := "DELETE FROM candidate WHERE id = $1"
	_, err := mapper.connection.Exec(query, id)
	if err != nil {
		return fmt.Errorf("Удаление из БД:", err)
	}
	return nil
}
