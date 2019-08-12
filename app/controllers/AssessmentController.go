package controllers

import (
	"encoding/json"
	"fmt"
	"AssessmentManager/app/providers"
	"AssessmentManager/app/structures"
	"github.com/revel/revel"
)

type AssessmentController struct {
	*revel.Controller
	provider *providers.AssessmentProvider
}

// AssessmentController.Get метод, обрабатывающий запрос GET /assessment,
// на получение списка всех собеседований.
// Возвращает ответ на запрос, содержащий срез с данными всех
// собеседований в формате JSON.
func (controller *AssessmentController) Get() revel.Result {
	var assessments *[]structures.Assessment
	var err error

	controller.provider = &providers.AssessmentProvider{}
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

	assessments, err = controller.provider.Get()

	if err != nil {
		fmt.Println(err)
		return controller.RenderError(err)
	}

	controller.Response.Status = 200  // OK

	return controller.RenderJSON(assessments)
}

// AssessmentController.GetById метод, обрабатывающий запрос GET /assessment/:id,
// на получение собеседования по указанному id.
// Возвращает ответ на запрос, содержащий объект с данными собеседования,
// в формате JSON.
func (controller *AssessmentController) GetById() revel.Result {
	id := controller.Params.Get("id")

	controller.provider = &providers.AssessmentProvider{}
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

	assessment, err := controller.provider.GetById(id)
	if err != nil {
		fmt.Println(err)
		return controller.RenderError(err)
	}

	controller.Response.Status = 200  // OK

	return controller.RenderJSON(assessment)
}

// AssessmentController.Create метод, обрабатывающий запрос PUT /assessment,
// на создание собеседования.
// Возвращает ответ на запрос, содержащий собеседование созданное в БД,
// в формате JSON.
func (controller *AssessmentController) Create() (revel.Result) {
	assessment := &structures.Assessment{}

	err := json.Unmarshal(controller.Params.JSON, assessment)
	if err != nil {
		fmt.Println(fmt.Errorf("Unmarshalling: ", err))
		return controller.RenderError(err)
	}

	controller.provider = &providers.AssessmentProvider{}

	err = controller.provider.Init()
	if err != nil {
		fmt.Println(fmt.Errorf("Инициализация провайдера: ", err))
		return controller.RenderError(err)
	}

	assessment, err = controller.provider.Create(assessment)
	if err != nil {
		fmt.Println(fmt.Errorf("Передача данных провайдеру: ", err))
		return controller.RenderError(err)
	}

	controller.Response.Status = 201  // Created
	return controller.RenderJSON(assessment)
}

// AssessmentController.Delete метод, обрабатывающий запрос DELETE /assessment/:id,
// на удаление собеседования по id.
// В случае успеха ответ на запрос возвращается пустым.
func (controller *AssessmentController) Delete() revel.Result {
	id := controller.Params.Get("id")
	controller.provider = &providers.AssessmentProvider{}

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

	controller.Response.Status = 204  // No Content
	return controller.RenderText("")
}

// AssessmentController.Update метод, обрабатывающий запрос POST /assessment/:id,
// обновление данных собеседования.
// Возвращает ответ на запрос, содержащий обновленные данные собеседования
// в БД, в формате JSON.
func (controller *AssessmentController) Update() (revel.Result) {
	assessment := &structures.Assessment{}
	err := json.Unmarshal(controller.Params.JSON, assessment)
	if err != nil {
		fmt.Println(fmt.Errorf("Unmarshalling: ", err))
		return controller.RenderError(err)
	}

	controller.provider = &providers.AssessmentProvider{}
	err = controller.provider.Init()
	if err != nil {
		fmt.Println(fmt.Errorf("Инициализация провайдера: ", err))
		return controller.RenderError(err)
	}

	assessment, err = controller.provider.Update(assessment)
	if err != nil {
		fmt.Println(fmt.Errorf("Передача данных провайдеру: ", err))
		return controller.RenderError(err)
	}

	controller.Response.Status = 200
	return controller.RenderJSON(assessment)
}
