package mappers

import (
	"AssessmentManager/app/structures"
	"errors"
	"fmt"
	"strconv"
)

// Маппер оформляющий и передающий запросы в БД.
type CandidateMapper struct {
	Mapper
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
			defer rows.Close()
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
			defer rows.Close()
			return nil, err
		}
	}

	if rows.Next() {
		return nil, errors.New("Unexpected query result.")
	}

	return &candidate, nil
}

// CandidateMapper.Create метод оформляет и передает запрос
// PUT /candidate/:id на создание записи кандидата в БД.
func (mapper *CandidateMapper) Create(candidate *structures.Candidate) (*structures.Candidate, error) {
	columnString, columnNum := tagString("sql_ins", *candidate)
	query := "INSERT INTO candidate (" + columnString +
		") VALUES " + substStr(columnNum, "$")

	result, err := mapper.connection.Exec(query, candidate.FirstName,
		candidate.MiddleName, candidate.LastName, candidate.BirthDate,
		candidate.Phone, candidate.Email)
	if err != nil {
		return nil, fmt.Errorf("Добавление в БД:", err)
	}

	// для тестов
	id, _ := result.LastInsertId() // id = 0 даже в случае успешной вставки
	fmt.Println("Добавленный id:", id) // видимо в postgres не реализовано
	//

	return candidate, nil
}

// CandidateMapper.Update метод оформляет и передает запрос
// POST /candidate/:id на изменение записи кандидата в БД.
func (mapper *CandidateMapper) Update(candidate *structures.Candidate) (*structures.Candidate, error) {
	setString, columnNum := tagSubstStr("sql_ins", *candidate)
	query := "UPDATE candidate SET " +
		setString +
		"WHERE id = $" + strconv.Itoa(columnNum + 1)

	result, err := mapper.connection.Exec(query, candidate.FirstName,
		candidate.MiddleName, candidate.LastName, candidate.BirthDate,
		candidate.Phone, candidate.Email, candidate.Id)

	if err != nil {
		return nil, fmt.Errorf("Обновление кандидата в БД:", err)
	}

	// для тестов
	rowNum, dbErr:= result.RowsAffected() // rowNum = 0 если такого id не найдено
	fmt.Println(rowNum, dbErr)			// rowNum = 1 если строка с id обновлена
										// dbErr = nil в обоих случаях
	//

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
