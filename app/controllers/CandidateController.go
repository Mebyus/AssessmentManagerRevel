package controllers

import (
	"AssessmentManager/app/providers"
	"AssessmentManager/app/structures"
	"encoding/json"
	"fmt"
	"github.com/revel/revel"
)

// Контроллер принимающий запросы от вкладки кандидатов
type CandidateController struct {
	*revel.Controller
	provider *providers.CandidateProvider
}

// CandidateController.Get метод, обрабатывающий запрос GET /candidate,
// на получение списка всех кандидатов.
// Возвращает ответ на запрос, содержащий массив с данными всех
// кандидатов в формате JSON.
func (controller *CandidateController) Get() revel.Result {
	var candidates *[]structures.Candidate
	var err error

	controller.provider = &providers.CandidateProvider{}
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

	candidates, err = controller.provider.Get()

	if err != nil {
		fmt.Println(err)
		return controller.RenderError(err)
	}

	controller.Response.Status = 200

	return controller.RenderJSON(candidates)
}

// CandidateController.GetById метод, обрабатывающий запрос GET /candidate/:id,
// на получение кандидата по указанному id.
// Возвращает ответ на запрос, содержащий объект с данными кандидата,
// в формате JSON.
func (controller *CandidateController) GetById() revel.Result {
	id := controller.Params.Get("id")
	controller.provider = &providers.CandidateProvider{}
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

	candidate, err := controller.provider.GetById(id)

	if err != nil {
		fmt.Println(err)
		return controller.RenderError(err)
	}

	controller.Response.Status = 200

	return controller.RenderJSON(candidate)
}

// CandidateController.Create метод, обрабатывающий запрос PUT /candidate,
// на создание кандидата.
// Возвращает ответ на запрос, кандидата созданного в БД,
// в формате JSON.
func (controller *CandidateController) Create() (revel.Result) {
	candidate := &structures.Candidate{}

	err := json.Unmarshal(controller.Params.JSON, candidate)
	if err != nil {
		fmt.Println(fmt.Errorf("Unmarshalling: ", err))
		return controller.RenderError(err)
	}

	controller.provider = &providers.CandidateProvider{}

	err = controller.provider.Init()
	if err != nil {
		fmt.Println(fmt.Errorf("Инициализация провайдера: ", err))
		return controller.RenderError(err)
	}

	candidate, err = controller.provider.Create(candidate)
	if err != nil {
		fmt.Println(fmt.Errorf("Передача данных провайдеру: ", err))
		return controller.RenderError(err)
	}

	controller.Response.Status = 201
	return controller.RenderJSON(candidate)
}

// CandidateController.Delete метод, обрабатывающий запрос DELETE /candidate/:id,
// на удаление кандидата по id.
// В случае успеха ответ на запрос возвращается пустым.
func (controller *CandidateController) Delete() revel.Result {
	id := controller.Params.Get("id")
	controller.provider = &providers.CandidateProvider{}

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

// CandidateController.Update метод, обрабатывающий запрос POST /candidate/:id,
// обновление данных кандидата.
// Возвращает ответ на запрос, содержащий обновленные данные кандидата
// в БД, в формате JSON.
func (controller *CandidateController) Update() (revel.Result) {
	candidate := &structures.Candidate{}

	err := json.Unmarshal(controller.Params.JSON, candidate)
	if err != nil {
		fmt.Println(fmt.Errorf("Unmarshalling: ", err))
		return controller.RenderError(err)
	}

	controller.provider = &providers.CandidateProvider{}

	err = controller.provider.Init()
	if err != nil {
		fmt.Println(fmt.Errorf("Инициализация провайдера: ", err))
		return controller.RenderError(err)
	}

	candidate, err = controller.provider.Update(candidate)
	if err != nil {
		fmt.Println(fmt.Errorf("Передача данных провайдеру: ", err))
		return controller.RenderError(err)
	}

	controller.Response.Status = 200
	return controller.RenderJSON(candidate)
}
