package mappers

import (
	"AssessmentManager/app/structures"
	"database/sql"
	"errors"
	"fmt"
	"strconv"
	"strings"
	"reflect"
)

// Маппер оформляющий и передающий запросы в БД.
type CandidateMapper struct {
	Mapper
	Connection *sql.DB
}

//Пример: tagSubstStr("extag", structVal) => "field_a = $1, field_b = $2, field_c = $3"
func tagSubstStr(tag string, value interface{}) (string) {
	var substList []string
	valueType := reflect.TypeOf(value)
	for i := 0; i < valueType.NumField(); i++ {
		name, ok := valueType.Field(i).Tag.Lookup(tag)
		if ok {
			substList = append(substList, name + " = $" + strconv.Itoa(i + 1))
		}
	}
	return strings.Join(substList, ", ")
}
// substStr возвращает строку для подстановки значний при вызове
// query INSERT.
//
// Пример: substStr(4, "$") => "($1, $2, $3, $4)"
func substStr(count int, specialSymbol string) (string) {
	var strList  []string
	for i := 1; i <= count; i++{
		strList = append(strList, specialSymbol + strconv.Itoa(i))
	}
	return "(" + strings.Join(strList, ", ") + ")"
}

// tagString возвращает строку со списком полей структуры отмеченных
// тегом, при этом поля переименовываются в соответствии со значением
// тега в дескрипторе.
func tagString(tag string, value interface{}) (string) {
	var nameList []string
	valueType := reflect.TypeOf(value)
	for i := 0; i < valueType.NumField(); i++ {
		name, ok := valueType.Field(i).Tag.Lookup(tag)
		if ok {
			nameList = append(nameList, name)
		}
	}
	return strings.Join(nameList, ", ")
}

// tagPtr возвращает срез ссылок на поля структуры отмеченные
// в дескрипторе тегом.
// valuePtr - указатель на структуру.
func tagPtr(tag string, valuePtr interface{}) ([]interface{}) {
	value := reflect.ValueOf(valuePtr).Elem()
	valueType := value.Type()
	var ptrList []interface{}
	for i := 0; i < valueType.NumField(); i++ {
		_, ok := valueType.Field(i).Tag.Lookup(tag)
		if ok {
			field := value.Field(i)
			ptrList = append(ptrList, field.Addr().Interface())
		}
	}
	return ptrList
}

// CandidateMapper.Get метод оформляет и передает запрос
// GET /candidate на получение списка всех кандидатов в БД.
func (mapper *CandidateMapper) Get() (*[]structures.Candidate, error) {
	candidates := []structures.Candidate{}

	query := "SELECT " + tagString("sql", structures.Candidate{}) +
		" FROM candidate"

	rows, err := mapper.Connection.Query(query)
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
	query := "SELECT id, firstname, middlename, lastname, birthdate, phone, email " +
				"FROM candidate WHERE id = $1"

	rows, err := mapper.Connection.Query(query, id)

	if err != nil {
		return nil, err
	}

	if rows.Next() {
		err = rows.Scan(&candidate.Id, &candidate.FirstName, &candidate.MiddleName,
			&candidate.LastName, &candidate.BirthDate, &candidate.Phone,
			&candidate.Email)

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
	query := "INSERT INTO candidate (" + tagString("sql_ins", *candidate) +
		") VALUES " + substStr(6, "$")

	result, err := mapper.Connection.Exec(query, candidate.FirstName,
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

// CandidateMapper.Create метод оформляет и передает запрос
// POST /candidate/:id на изменение записи кандидата в БД.
func (mapper *CandidateMapper) Update(candidate *structures.Candidate) (*structures.Candidate, error) {
	query := "UPDATE candidate SET " +
		"first_name = $1, " +
		"middle_name = $2, " +
		"last_name = $3, " +
		"birth_date = $4, " +
		"phone = $5, " +
		"email = $6 " +
		"WHERE id = $7 "

	result, err := mapper.Connection.Exec(query, candidate.FirstName,
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

// CandidateMapper.Create метод оформляет и передает запрос
// DELETE /candidate/:id на удаление записи кандидата по id в БД.
func (mapper *CandidateMapper) Delete(id string) (error) {
	query := "DELETE FROM candidate WHERE id = $1"
	_, err := mapper.Connection.Exec(query, id)
	if err != nil {
		return fmt.Errorf("Удаление из БД:", err)
	}
	return nil
}
