package mappers

import (
	"AssessmentManager/app/structures"
	"fmt"
	"errors"
	"strconv"
)

type EmployeeMapper struct {
	Mapper
}

// EmployeeMapper.Get метод оформляет и передает запрос
// GET /employee на получение списка всех сотрудников в БД.
func (mapper *EmployeeMapper) Get() (*[]structures.Employee, error) {
	employees := []structures.Employee{}
	columnString, _ := tagString("sql", structures.Employee{})
	query := "SELECT " + columnString +
		" FROM employee;"

	rows, err := mapper.connection.Query(query)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		employee := structures.Employee{}
		err = rows.Scan(tagPtr("sql", &employee)...)

		if err != nil {
			defer func() {
				closeErr := rows.Close()
				if closeErr != nil {
					fmt.Println(closeErr)
				}
			}()
			return nil, err
		}
		employees = append(employees, employee)
	}
	return &employees, nil
}

// EmployeeMapper.GetById метод оформляет и передает запрос
// GET /employee/:id на получение сотрудника по заданному id в БД.
func (mapper *EmployeeMapper) GetById(id string) (*structures.Employee, error) {
	employee := structures.Employee{}

	// Запрашиваем основную информацию о сотруднике
	columnString, _ := tagString("sql", employee)
	query := "SELECT " + columnString +
		" FROM employee WHERE id = $1;"

	rows, err := mapper.connection.Query(query, id)

	if err != nil {
		return nil, err
	}

	if rows.Next() {
		err = rows.Scan(tagPtr("sql", &employee)...)

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

	// Запрашиваем информацию о собеседованиях, в которых принимает участие сотрудник
	query = "SELECT id, assessment, employee  " +
		"FROM assessment_employee WHERE employee = $1"
	assessmentRows, err := mapper.connection.Query(query, id)
	if err != nil {
		return nil, err
	}
	for assessmentRows.Next() {
		assessment := structures.AssessmentEmployee{}
		err = assessmentRows.Scan(&assessment.Id, &assessment.AssessmentId,
			&assessment.EmployeeId)

		if err != nil {
			defer func() {
				closeErr := assessmentRows.Close()
				if closeErr != nil {
					fmt.Println(closeErr)
				}
			}()
			return nil, err
		}
		employee.AssessmentList = append(employee.AssessmentList, &assessment)
	}

	return &employee, nil
}

// EmployeeMapper.Create метод оформляет и передает запрос
// PUT /employee/:id на создание записи сотрудника в БД.
func (mapper *EmployeeMapper) Create(employee *structures.Employee) (*structures.Employee, error) {
	var newId int64
	var strId string

	columnString, columnNum := tagString("sql_ins", structures.Employee{})
	query := "INSERT INTO employee (" + columnString +
		") VALUES " + substStr(columnNum, "$") + " RETURNING id;"

	row := mapper.connection.QueryRow(query, employee.FirstName,
		employee.MiddleName, employee.LastName)

	// Получаем id нового сотрудника из БД
	err := row.Scan(&newId)
	if err != nil {
		return nil, fmt.Errorf("Добавление сотрудника в БД:\n", err)
	}
	strId = strconv.FormatInt(newId, 10)
	employee.SetNewId(newId)

	// Изменяем таблицы связей сотрудников
	err = mapper.CreateEmployeeAssessment(strId, employee)
	if err != nil {
		return nil, fmt.Errorf("Создание списка собеседований для сотрудника в БД:\n", err)
	}

	return employee, nil
}

// EmployeeMapper.CreateEmployeeAssessment вспомогательный метод запросов PUT и POST,
// предназначен для создания связей сотрудника и собеседований.
func (mapper *EmployeeMapper) CreateEmployeeAssessment(employeeId string, employee *structures.Employee) (error) {
	query := "INSERT INTO assessment_employee(assessment, employee) VALUES " +
		employee.AssessmentListStr() +
		" ON CONFLICT DO NOTHING;"
	_, err := mapper.connection.Exec(query)
	if err != nil {
		return fmt.Errorf("Добавление собеседований сотрудника %s в БД:\n", employeeId, err)
	}
	return nil
}

// EmployeeMapper.AlterEmployeeAssessment вспомогательный метод запросов POST,
// предназначен для модификации таблицы связей сотрудника и собеседований.
func (mapper *EmployeeMapper) AlterEmployeeAssessment(employeeId string, employee *structures.Employee) (error) {
	// Делаем запрос на удаление старых связей сотрудника
	query := "DELETE FROM assessment_employee WHERE employee = $1"
	_, err := mapper.connection.Exec(query, employeeId)
	if err != nil {
		return fmt.Errorf("Удаление собеседований сотрудника %s из БД:\n", employeeId, err)
	}

	// Делаем запрос на добавление обновленных связей
	err = mapper.CreateEmployeeAssessment(employeeId, employee)
	if err != nil {
		return err
	}
	return nil
}

// EmployeeMapper.Update метод оформляет и передает запрос
// POST /employee/:id на изменение записи сотрудника в БД.
func (mapper *EmployeeMapper) Update(employee *structures.Employee) (*structures.Employee, error) {
	strId := strconv.FormatInt(employee.Id, 10)

	// Изменение основной информации сотрудника
	setString, columnNum := tagSubstStr("sql_ins", *employee)
	query := "UPDATE employee SET " +
		setString +
		"WHERE id = $" + strconv.Itoa(columnNum + 1) + ";"

	_, err := mapper.connection.Exec(query, append(tagValue("sql_ins", employee), employee.Id)...)
	if err != nil {
		return nil, fmt.Errorf("Обновление сотрудника в БД:", err)
	}

	// Изменение таблицы связей сотрудников и собеседований
	err = mapper.AlterEmployeeAssessment(strId, employee)
	if err != nil {
		return nil, err
	}

	return employee, nil
}

// EmployeeMapper.Delete метод оформляет и передает запрос
// DELETE /employee/:id на удаление записи сотрудника по id в БД.
func (mapper *EmployeeMapper) Delete(id string) (error) {
	query := "DELETE FROM employee WHERE id = $1;"
	_, err := mapper.connection.Exec(query, id)
	if err != nil {
		return fmt.Errorf("Удаление сотрудника из БД:", err)
	}
	return nil
}
