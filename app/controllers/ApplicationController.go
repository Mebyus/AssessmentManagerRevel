package controllers

import (
	"github.com/revel/revel"
)

type ApplicationController struct {
	LoginController
}

func (manager ApplicationController) Index() revel.Result {
	return manager.Render()
}


// Перехватчик для проверки авторизации пользователя
func (manager ApplicationController) checkUser() revel.Result {
	if user := manager.connected(); user == nil {
		manager.Flash.Error("Please log in first")
		return manager.Redirect(LoginController.Index)
	}
	return nil
}