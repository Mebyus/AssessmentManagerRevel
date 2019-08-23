package mappers

import (
	"AssessmentManager/app/structures"
	"database/sql"
	"fmt"
	"errors"
	"strconv"
)

type AssessmentMapper struct {
	Mapper
}

func (mapper *AssessmentMapper) Init(connection *sql.DB) (error) {
	err := mapper.Connect(connection)
	if err != nil {
		return fmt.Errorf("Создание соединения AssessmentMapper с БД:\n", err)
	}
	return nil
}

// AssessmentMapper.Get метод оформляет и передает запрос
// GET /assessment на получение списка всех собеседований в БД.
func (mapper *AssessmentMapper) Search(dateRange *structures.DateRange) (*[]structures.Assessment, error) {
	assessments := []structures.Assessment{}
	columnString, _ := tagString("sql", structures.Assessment{})
	query := "SELECT " + columnString +
		" FROM assessment WHERE " +
		"date_time <@ tsrange($1, $2, '[]');"

	rows, err := mapper.connection.Query(query, dateRange.Start, dateRange.End)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		assessment := structures.Assessment{}
		err = rows.Scan(tagPtr("sql", &assessment)...)

		if err != nil {
			defer func() {
				closeErr := rows.Close()
				if closeErr != nil {
					fmt.Println(closeErr)
				}
			}()
			return nil, err
		}
		assessments = append(assessments, assessment)
	}
	return &assessments, nil
}

// AssessmentMapper.Get метод оформляет и передает запрос
// GET /assessment на получение списка всех собеседований в БД.
func (mapper *AssessmentMapper) Get() (*[]structures.Assessment, error) {
	assessments := []structures.Assessment{}
	columnString, _ := tagString("sql", structures.Assessment{})
	query := "SELECT " + columnString +
		" FROM assessment;"

	rows, err := mapper.connection.Query(query)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		assessment := structures.Assessment{}
		err = rows.Scan(tagPtr("sql", &assessment)...)

		if err != nil {
			defer func() {
				closeErr := rows.Close()
				if closeErr != nil {
					fmt.Println(closeErr)
				}
			}()
			return nil, err
		}
		assessments = append(assessments, assessment)
	}
	return &assessments, nil
}

// AssessmentMapper.GetById метод оформляет и передает запрос
// GET /assessment/:id на получение собеседования по заданному id в БД.
func (mapper *AssessmentMapper) GetById(id string) (*structures.Assessment, error) {
	assessment := structures.Assessment{}

	// Запрашиваем основную информацию о собеседовании
	columnString, _ := tagString("sql", assessment)
	query := "SELECT " + columnString +
		" FROM assessment WHERE id = $1;"
	rows, err := mapper.connection.Query(query, id)
	if err != nil {
		return nil, err
	}

	if rows.Next() {
		err = rows.Scan(tagPtr("sql", &assessment)...)

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

	// Запрашиваем информацию о кандидатах, назначенных на собеседование
	query = "SELECT a.assessment, a.candidate, a.is_confirmed, a.result, a.comment, b.last_name, b.first_name " +
		"FROM (SELECT * FROM candidate_for_assessment WHERE assessment = $1) as a " +
		"LEFT JOIN candidate as b ON a.candidate = b.id;"


	candidateRows, err := mapper.connection.Query(query, id)
	if err != nil {
		return nil, err
	}
	for candidateRows.Next() {
		isConfirmed := sql.NullBool{}
		candidate := structures.CandidateForAssessment{}
		err = candidateRows.Scan(&candidate.AssessmentId, &candidate.CandidateId, &isConfirmed,
				&candidate.Result, &candidate.Comment, &candidate.LastName, &candidate.FirstName)

		if isConfirmed.Valid {
			candidate.IsConfirmed = fmt.Sprintf("%t", isConfirmed.Bool)
		} else {
			candidate.IsConfirmed = "null"
		}

		if err != nil {
			defer func() {
				closeErr := candidateRows.Close()
				if closeErr != nil {
					fmt.Println(closeErr)
				}
			}()
			return nil, err
		}
		assessment.CandidateList = append(assessment.CandidateList, &candidate)
	}

	// Запрашиваем информацию о сотрудниках, назначенных на собеседование
	query = "SELECT a.assessment, a.employee, b.last_name, b.first_name " +
		"FROM (SELECT * FROM assessment_employee WHERE assessment = $1) as a " +
		"LEFT JOIN employee as b ON a.employee = b.id;"
	employeeRows, err := mapper.connection.Query(query, id)
	if err != nil {
		return nil, err
	}
	for employeeRows.Next() {
		employee := structures.AssessmentEmployee{}
		err = employeeRows.Scan(&employee.AssessmentId, &employee.EmployeeId, &employee.LastName, &employee.FirstName)

		if err != nil {
			defer func() {
				closeErr := employeeRows.Close()
				if closeErr != nil {
					fmt.Println(closeErr)
				}
			}()
			return nil, err
		}
		assessment.EmployeeList = append(assessment.EmployeeList, &employee)
	}

	return &assessment, nil
}

// AssessmentMapper.Create метод оформляет и передает запрос
// PUT /assessment/:id на создание записи собеседования в БД.
func (mapper *AssessmentMapper) Create(assessment *structures.Assessment) (*structures.Assessment, error) {
	var newId int64
	var strId string

	// Добавляем основную информацию о собеседовании
	columnString, columnNum := tagString("sql_ins", structures.Assessment{})
	query := "INSERT INTO assessment (" + columnString +
		") VALUES " + substStr(columnNum, "$") + " RETURNING id;"
	row := mapper.connection.QueryRow(query, tagValue("sql_ins", assessment)...)

	// Получаем id нового собеседования из БД
	err := row.Scan(&newId)
	if err != nil {
		return nil, fmt.Errorf("Добавление собеседования в БД:", err)
	}
	strId = strconv.FormatInt(newId, 10)
	assessment.SetNewId(newId)

	// Изменяем таблицы связей сотрудников и кандидатов
	err = mapper.CreateAssessmentEmployee(strId, assessment)
	if err != nil {
		return nil, fmt.Errorf("Создание списка сотрудников на собеседование в БД:", err)
	}

	err = mapper.CreateAssessmentCandidate(strId, assessment)
	if err != nil {
		return nil, fmt.Errorf("Создание списка кандидатов на собеседование в БД:", err)
	}

	return assessment, nil
}

// AssessmentMapper.AlterAssessmentEmployee вспомогательный метод запросов PUT и POST,
// предназначен для создания связей собеседования и сотрудников.
func (mapper *AssessmentMapper) CreateAssessmentEmployee(assessmentId string, assessment *structures.Assessment) (error) {
	if assessment.HasEmployees() {
		query := "INSERT INTO assessment_employee(assessment, employee) VALUES " +
			assessment.EmployeeListStr() +
			" ON CONFLICT DO NOTHING;"
		_, err := mapper.connection.Exec(query)
		if err != nil {
			return fmt.Errorf("Добавление сотрудников на собеседование %s в БД:\n", assessmentId, err)
		}
	}
	return nil
}

// AssessmentMapper.AlterAssessmentCandidate вспомогательный метод запросов PUT и POST,
// предназначен для создания связей собеседования и кандидатов.
func (mapper *AssessmentMapper) CreateAssessmentCandidate(assessmentId string, assessment *structures.Assessment) (error) {
	if assessment.HasCandidates() {
		query := "INSERT INTO candidate_for_assessment(assessment, candidate, is_confirmed, result, comment) VALUES " +
			assessment.CandidateListStr() +
			" ON CONFLICT DO NOTHING;"
		fmt.Println(query)
		_, err := mapper.connection.Exec(query)
		if err != nil {
			return fmt.Errorf("Добавление кандидатов на собеседование %s в БД:", assessmentId, err)
		}
	}
	return nil
}

// AssessmentMapper.AlterAssessmentCandidate вспомогательный метод запросов POST,
// предназначен для модификации таблицы связей собеседования и кандидатов.
func (mapper *AssessmentMapper) AlterAssessmentCandidate(assessmentId string, assessment *structures.Assessment) (error) {
	// Делаем запрос на удаление старых связей собеседования
	query := "DELETE FROM candidate_for_assessment WHERE assessment = $1"
	_, err := mapper.connection.Exec(query, assessmentId)
	if err != nil {
		return fmt.Errorf("Удаление кандидатов на собеседование %s в БД:", assessmentId, err)
	}

	// Делаем запрос на добавление обновленных связей
	err = mapper.CreateAssessmentCandidate(assessmentId, assessment)
	if err != nil {
		return err
	}

	return nil
}

// AssessmentMapper.AlterAssessmentEmployee вспомагательный метод запросов POST,
// предназначен для модификации таблицы связей собеседования и сотрудников.
func (mapper *AssessmentMapper) AlterAssessmentEmployee(assessmentId string, assessment *structures.Assessment) (error) {
	// Делаем запрос на удаление старых связей собеседования
	query := "DELETE FROM assessment_employee WHERE assessment = $1"
	_, err := mapper.connection.Exec(query, assessmentId)
	if err != nil {
		return fmt.Errorf("Удаление сотрудников на собеседование %s в БД:\n", assessmentId, err)
	}

	// Делаем запрос на добавление обновленных связей
	err = mapper.CreateAssessmentEmployee(assessmentId, assessment)
	if err != nil {
		return err
	}
	return nil
}

// AssessmentMapper.Update метод оформляет и передает запрос
// POST /assessment/:id на изменение записи собеседования в БД.
func (mapper *AssessmentMapper) Update(assessment *structures.Assessment) (*structures.Assessment, error) {
	strId := strconv.FormatInt(assessment.Id, 10)

	// Обновляем основную информацию о собеседовании
	setString, columnNum := tagSubstStr("sql_ins", *assessment)
	query := "UPDATE assessment SET " +
		setString +
		"WHERE id = $" + strconv.Itoa(columnNum + 1) + ";"
	_, err := mapper.connection.Exec(query, append(tagValue("sql_ins", assessment), assessment.Id)...)
	if err != nil {
		return nil, fmt.Errorf("Обновление собеседования в БД:", err)
	}

	// Обновляем таблицы связей сотрудников и кандидатов
	err = mapper.AlterAssessmentEmployee(strId, assessment)
	if err != nil {
		return nil, err
	}
	err = mapper.AlterAssessmentCandidate(strId, assessment)
	if err != nil {
		return nil, err
	}

	return assessment, nil
}

// AssessmentMapper.Delete метод оформляет и передает запрос
// DELETE /assessment/:id на удаление записи собеседования по id в БД.
func (mapper *AssessmentMapper) Delete(id string) (error) {
	query := "DELETE FROM assessment WHERE id = $1;"
	_, err := mapper.connection.Exec(query, id)
	if err != nil {
		return fmt.Errorf("Удаление собеседования из БД:", err)
	}
	return nil
}