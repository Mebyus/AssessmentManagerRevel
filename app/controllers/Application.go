package controllers

import (
	"github.com/revel/revel"
)

type Application struct {
	*revel.Controller
}

func (app Application) Index() revel.Result {
	c.Flash.Out["username"] = username
	return app.Render()
}

//func (app Application) Index() revel.Result {
//	return app.Redirect(Application.Manager)
//}

//func (app Application) Login() revel.Result {
//	return app.Render()
//}

func (app Application) Manager() revel.Result {
	return app.Render()
}
