package controllers

import (
	"github.com/revel/revel"
)

type Manager struct {
	Application
}

func (manager Manager) Index() revel.Result {
	return manager.Render()
}

func (manager Manager) checkUser() revel.Result {
	if user := manager.connected(); user == nil {
		manager.Flash.Error("Please log in first")
		return manager.Redirect(Application.Index)
	}
	return nil
}