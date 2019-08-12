package controllers

import (
	"AssessmentManager/app/providers"
	"AssessmentManager/app/structures"
	"encoding/json"
	"github.com/revel/revel"
	"fmt"
)

type EmployeeController struct {
	*revel.Controller
	provider *providers.EmployeeProvider
}

// EmployeeController.Get метод, обрабатывающий запрос GET /employee,
// на получение списка всех сотрудников.
// Возвращает ответ на запрос, содержащий срез с данными всех
// сотрудников в формате JSON.
func (controller *EmployeeController) Get() revel.Result {
	var employees *[]structures.Employee
	var err error

	controller.provider = &providers.EmployeeProvider{}
	err = controller.provider.Init()
	if err != nil {
		return controller.RenderError(err)
	}
	defer func() {
		err := controller.provider.Disconnect()
		if err != nil {
			fmt.Println(err)
		}
	}()

	employees, err = controller.provider.Get()

	if err != nil {
		fmt.Println(err)
		return controller.RenderError(err)
	}

	controller.Response.Status = 200

	return controller.RenderJSON(employees)
}

// EmployeeController.GetById метод, обрабатывающий запрос GET /employee/:id,
// на получение сотрудника по указанному id.
// Возвращает ответ на запрос, содержащий объект с данными сотрудника,
// в формате JSON.
func (controller *EmployeeController) GetById() revel.Result {
	id := controller.Params.Get("id")
	controller.provider = &providers.EmployeeProvider{}
	err := controller.provider.Init()
	if err != nil {
		return controller.RenderError(err)
	}
	defer func() {
		err := controller.provider.Disconnect()
		if err != nil {
			fmt.Println(err)
		}
	}()

	employee, err := controller.provider.GetById(id)

	if err != nil {
		fmt.Println(err)
		return controller.RenderError(err)
	}

	controller.Response.Status = 200

	return controller.RenderJSON(employee)
}

// EmployeeController.Create метод, обрабатывающий запрос PUT /employee,
// на создание сотрудника.
// Возвращает ответ на запрос, содержащий сотрудника созданного в БД,
// в формате JSON.
func (controller *EmployeeController) Create() (revel.Result) {
	employee := &structures.Employee{}

	err := json.Unmarshal(controller.Params.JSON, employee)
	if err != nil {
		fmt.Println(fmt.Errorf("Unmarshalling: ", err))
		return controller.RenderError(err)
	}

	controller.provider = &providers.EmployeeProvider{}

	err = controller.provider.Init()
	if err != nil {
		fmt.Println(fmt.Errorf("Инициализация провайдера: ", err))
		return controller.RenderError(err)
	}

	employee, err = controller.provider.Create(employee)
	if err != nil {
		fmt.Println(fmt.Errorf("Передача данных провайдеру: ", err))
		return controller.RenderError(err)
	}

	controller.Response.Status = 201
	return controller.RenderJSON(employee)
}

// EmployeeController.Delete метод, обрабатывающий запрос DELETE /employee/:id,
// на удаление сотрудника по id.
// В случае успеха ответ на запрос возвращается пустым.
func (controller *EmployeeController) Delete() revel.Result {
	id := controller.Params.Get("id")
	controller.provider = &providers.EmployeeProvider{}

	err := controller.provider.Init()
	if err != nil {
		fmt.Println(fmt.Errorf("Инициализация провайдера: ", err))
		return controller.RenderError(err)
	}
	defer func() {
		err := controller.provider.Disconnect()
		if err != nil {
			fmt.Println(err)
		}
	}()

	err = controller.provider.Delete(id)

	if err != nil {
		fmt.Println(err)
		return controller.RenderError(err)
	}

	controller.Response.Status = 204
	return controller.RenderText("")
}

// EmployeeController.Update метод, обрабатывающий запрос POST /employee/:id,
// обновление данных сотрудника.
// Возвращает ответ на запрос, содержащий обновленные данные сотрудника
// в БД, в формате JSON.
func (controller *EmployeeController) Update() (revel.Result) {
	employee := &structures.Employee{}
	err := json.Unmarshal(controller.Params.JSON, employee)
	if err != nil {
		fmt.Println(fmt.Errorf("Unmarshalling: ", err))
		return controller.RenderError(err)
	}

	controller.provider = &providers.EmployeeProvider{}
	err = controller.provider.Init()
	if err != nil {
		fmt.Println(fmt.Errorf("Инициализация провайдера: ", err))
		return controller.RenderError(err)
	}

	employee, err = controller.provider.Update(employee)
	if err != nil {
		fmt.Println(fmt.Errorf("Передача данных провайдеру: ", err))
		return controller.RenderError(err)
	}

	controller.Response.Status = 200
	return controller.RenderJSON(employee)
}
