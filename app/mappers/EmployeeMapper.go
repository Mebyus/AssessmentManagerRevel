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

	return &employee, nil
}

// EmployeeMapper.Create метод оформляет и передает запрос
// PUT /employee/:id на создание записи сотрудника в БД.
func (mapper *EmployeeMapper) Create(employee *structures.Employee) (*structures.Employee, error) {
	columnString, columnNum := tagString("sql_ins", structures.Employee{})
	query := "INSERT INTO employee (" + columnString +
		") VALUES " + substStr(columnNum, "$") + ";"

	_, err := mapper.connection.Exec(query, employee.FirstName,
		employee.MiddleName, employee.LastName)
	if err != nil {
		return nil, fmt.Errorf("Добавление в БД:", err)
	}

	return employee, nil
}

// EmployeeMapper.Update метод оформляет и передает запрос
// POST /employee/:id на изменение записи сотрудника в БД.
func (mapper *EmployeeMapper) Update(employee *structures.Employee) (*structures.Employee, error) {
	setString, columnNum := tagSubstStr("sql_ins", *employee)
	query := "UPDATE employee SET " +
		setString +
		"WHERE id = $" + strconv.Itoa(columnNum + 1) + ";"

	_, err := mapper.connection.Exec(query, append(tagValue("sql_ins", employee), employee.Id)...)

	if err != nil {
		return nil, fmt.Errorf("Обновление сотрудника в БД:", err)
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
