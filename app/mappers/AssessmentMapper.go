package mappers

import (
	"AssessmentManager/app/structures"
	"database/sql"
	"fmt"
	"errors"
	"strconv"
	"strings"
)

type AssessmentMapper struct {
	Mapper
}

func (mapper *AssessmentMapper) Init(connection *sql.DB) (error) {
	err := mapper.Connect(connection)
	if err != nil {
		return fmt.Errorf("Создание соединения AssessmentMapper с БД:", err)
	}
	return nil
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

	return &assessment, nil
}

// AssessmentMapper.Create метод оформляет и передает запрос
// PUT /assessment/:id на создание записи собеседования в БД.
func (mapper *AssessmentMapper) Create(assessment *structures.Assessment) (*structures.Assessment, error) {
	var newId string

	columnString, columnNum := tagString("sql_ins", structures.Assessment{})
	query := "INSERT INTO assessment (" + columnString +
		") VALUES " + substStr(columnNum, "$") + " RETURNING id;"

	row:= mapper.connection.QueryRow(query, tagValue("sql_ins", assessment)...)

	err := row.Scan(&newId)
	if err != nil {
		return nil, fmt.Errorf("Добавление собеседования в БД:", err)
	}

	err = mapper.AlterAssessmentEmployee(newId, &assessment.EmployeeList)
	if err != nil {
		return nil, fmt.Errorf("Изменение списка сотрудников на собеседование в БД:", err)
	}

	return assessment, nil
}

// findEmployee находит индекс элемента в срезе из AssessmentEmployee,
// id которого совпадает со вторым аргументом функции.
func findEmployee(slc []*structures.AssessmentEmployee, id int64) (int) {
	for i := range slc {
		if slc[i].EmployeeId == id {
			return i
		}
	}
	return -1
}

// FIXME Подобрать нормальное название
// Возвращает строку -- список id записей в срезе из AssessmentEmployee
func employeeSliceToStrId(slc []*structures.AssessmentEmployee) (string) {
	strList := []string{}
	for i := range slc {
		strList = append(strList, fmt.Sprintf("%d", slc[i].Id))
	}
	return strings.Join(strList, ", ")
}

// FIXME Подобрать нормальное название
// Возвращает строку -- список пар вида (assessment_id, employee_id) по срезу
// из id сотрудников и фиксированного id собеседования.
func employeeIdSliceToQuery(slc []int64, assessment_id int64) (string) {
	strList := []string{}
	strId := fmt.Sprintf("%d" ,assessment_id)
	for i := range slc {
		strList = append(strList, "(" + strId + ", " + fmt.Sprintf("%d", slc[i]) + ")")
	}
	return strings.Join(strList, ", ")
}

// TODO декомпозировать этого монстра
// AssessmentMapper.AlterAssessmentEmployee вспомагательный метод запросов PUT и UPDATE,
// предназначен для модификации таблицы связей собеседования и сотрудников.
//
// Аргументы:
// id - id собеседования для модификации
// empId - указатель на срез из id сотрудников
//
// Примечания:
// Список сотрудников ПОЛНОСТЬЮ заменяет старый список в собеседовании с данным id;
// недостающие записи добавляются, лишние удаляются.
func (mapper *AssessmentMapper) AlterAssessmentEmployee(id string, empId *[]int64) (error) {
	idInt64, err := strconv.ParseInt(id, 10, 64)
	if err != nil {
		return fmt.Errorf("Преобразование id в int64:", err)
	}

	// Делаем запрос на список сотрудников, приписанных к собеседованию
	// с данным id
	query := "SELECT (id, employee) " +
				"FROM assessment_employee " +
				"WHERE assessment = $1"
	rows, err := mapper.connection.Query(query, id)
	if err != nil {
		return err
	}

	aEmployees := []*structures.AssessmentEmployee{}
	for rows.Next() {
		aEmployee := structures.AssessmentEmployee{AssessmentId: idInt64}
		err = rows.Scan(&aEmployee.Id, &aEmployee.EmployeeId)

		if err != nil {
			defer func() {
				closeErr := rows.Close()
				if closeErr != nil {
					fmt.Println(closeErr)
				}
			}()
			return err
		}
		aEmployees = append(aEmployees, &aEmployee)
	}

	// Ищем сотрудников, которых надо удалить или добавить в собеседование
	aEmployeesToAdd := []int64{}
	for i := range *empId {
		if len(aEmployees) > 0 {
			index := findEmployee(aEmployees, (*empId)[i])
			if index == -1 {
				aEmployeesToAdd = append(aEmployeesToAdd, (*empId)[i])
			} else {
				// Удаляем найденного сотрудника из списка
				aEmployees[index] = aEmployees[len(aEmployees) - 1]
				aEmployees = aEmployees[:len(aEmployees) - 1]
			}
		} else {
			aEmployeesToAdd = append(aEmployeesToAdd, (*empId)[i])
		}
	}

	// Удаляем оставшихся в aEmployee сотрудников, поскольку их не оказалось в списке empId
	if len(aEmployees) > 0 {
		query = fmt.Sprintf("DELETE FROM assessment_employee WHERE id IN (%s)", employeeSliceToStrId(aEmployees))
		_, err = mapper.connection.Exec(query)
		if err != nil {
			return fmt.Errorf("Удаление сотрудников на собеседование из БД:", err)
		}
	}

	// Добавляем новых сотрудников для этого собеседования
	if len(aEmployeesToAdd) > 0 {
		query = "INSERT INTO assessment_employee(assessment, employee) VALUES " +
			employeeIdSliceToQuery(aEmployeesToAdd, idInt64)
		_, err = mapper.connection.Exec(query)
		if err != nil {
			return fmt.Errorf("Добавление новых сотрудников на собеседование в БД:", err)
		}
	}
	return nil
}

// AssessmentMapper.Update метод оформляет и передает запрос
// POST /assessment/:id на изменение записи собеседования в БД.
func (mapper *AssessmentMapper) Update(assessment *structures.Assessment) (*structures.Assessment, error) {
	setString, columnNum := tagSubstStr("sql_ins", *assessment)
	query := "UPDATE assessment SET " +
		setString +
		"WHERE id = $" + strconv.Itoa(columnNum + 1) + ";"

	_, err := mapper.connection.Exec(query, append(tagValue("sql_ins", assessment), assessment.Id)...)

	if err != nil {
		return nil, fmt.Errorf("Обновление собеседования в БД:", err)
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