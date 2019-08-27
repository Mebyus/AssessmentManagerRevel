package controllers

import (
	"golang.org/x/crypto/bcrypt"
	"AssessmentManager/app/providers"
	"AssessmentManager/app/structures"
	"github.com/revel/revel"
	"fmt"
)

type LoginController struct {
	*revel.Controller
	provider *providers.UserProvider
}

func (app LoginController) Index() revel.Result {
	if app.connected() != nil {
		return app.Redirect(ApplicationController.Index)
	}

	return app.Render()
}

// Проверяет является ли сессия авторизованной
func (app LoginController) connected() *structures.User {
	//if app.ViewArgs["user"] != nil {
	//	fmt.Println("Found user in template args")
	//	return app.ViewArgs["user"].(*structures.User)
	//}
	if username, ok := app.Session["user"]; ok {
		return app.getUser(username.(string))
	}
	return nil
}

//func (app LoginController) AddUser() revel.Result {
//	fmt.Println("Trying to add user")
//	if user := app.connected(); user != nil {
//		fmt.Println("User added to template args")
//		app.ViewArgs["user"] = user
//	}
//	return nil
//}

func (app LoginController) Register() revel.Result {
	if app.connected() != nil {
		return app.Redirect(ApplicationController.Index)
	}

	return app.Render()
}

// Сохраняет пользователя в БД
func (app LoginController) SaveUser(user structures.User, verifyPassword string) revel.Result {
	app.Validation.Required(verifyPassword)
	app.Validation.Required(verifyPassword == user.Password).MessageKey("Password does not match")
	user.Validate(app.Validation)

	if app.Validation.HasErrors() {
		app.Validation.Keep()
		app.FlashParams()
		return app.Redirect(LoginController.Register)
	}

	user.HashedPassword, _ = bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)

	app.provider = &providers.UserProvider{}
	err := app.provider.Init()
	if err != nil {
		return nil
	}
	defer func() {
		err := app.provider.Disconnect()
		if err != nil {
			fmt.Println(err)
		}
	}()

	err = app.provider.SaveUser(&user)
	if err != nil {
		panic(err)
	}

	app.Session["user"] = user.Username
	return app.Redirect(ApplicationController.Index)
}

// Поиск пользователя в БД
func (app LoginController) getUser(username string) (*structures.User) {
	app.provider = &providers.UserProvider{}
	err := app.provider.Init()
	if err != nil {
		return nil
	}
	defer func() {
		err := app.provider.Disconnect()
		if err != nil {
			fmt.Println(err)
		}
	}()

	user, err := app.provider.GetUser(username)
	if err != nil {
		app.Log.Error("Failed to find user", "user", username, "error", err)
		return nil
	}

	return user
}

// Обработка запроса POST /login
func (app LoginController) Login(username, password string, remember bool) revel.Result {
	user := app.getUser(username)
	if user != nil {
		err := bcrypt.CompareHashAndPassword(user.HashedPassword, []byte(password))
		if err == nil {
			app.Session["user"] = username
			if remember {
				app.Session.SetDefaultExpiration()
			} else {
				app.Session.SetNoExpiration()
			}
			app.Flash.Success("Welcome, " + username)
			return app.Redirect(ApplicationController.Index)
		}
	}

	return app.Redirect(LoginController.Index)
}

func (app LoginController) Logout() revel.Result {
	for k := range app.Session {
		delete(app.Session, k)
	}
	return app.Redirect(LoginController.Index)
}
