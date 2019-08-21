package controllers

import (
	"golang.org/x/crypto/bcrypt"
	"AssessmentManager/app/providers"
	"AssessmentManager/app/structures"
	"github.com/revel/revel"
	"fmt"
)

type Application struct {
	*revel.Controller
	provider *providers.UserProvider
}

func (app Application) Index() revel.Result {
	if app.connected() != nil {
		return app.Redirect(Manager.Index)
	}

	app.Flash.Error("Please log in first")
	return app.Render()
}

func (app Application) connected() *structures.User {
	if app.ViewArgs["user"] != nil {
		return app.ViewArgs["user"].(*structures.User)
	}
	if username, ok := app.Session["user"]; ok {
		return app.getUser(username.(string))
	}
	return nil
}

func (app Application) AddUser() revel.Result {
	if user := app.connected(); user != nil {
		app.ViewArgs["user"] = user
	}
	return nil
}

func (app Application) Register() revel.Result {
	return app.Render()
}

func (app Application) SaveUser(user structures.User, verifyPassword string) revel.Result {
	app.Validation.Required(verifyPassword)
	app.Validation.Required(verifyPassword == user.Password).MessageKey("Password does not match")
	user.Validate(app.Validation)

	if app.Validation.HasErrors() {
		app.Validation.Keep()
		app.FlashParams()
		return app.Redirect(Application.Register)
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
	app.Flash.Success("Welcome, " + user.Name)
	return app.Redirect(Manager.Index)
}

// Запрос данных пользователя, если такой существует
func (app Application) getUser(username string) (*structures.User) {
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

	app.Session["fulluser"] = user
	return user
}

// Обработка запроса POST /login
func (app Application) Login(username, password string, remember bool) revel.Result {
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
			return app.Redirect(Manager.Index)
		}
	}

	app.Flash.Out["username"] = username
	app.Flash.Error("Login failed")
	return app.Redirect(Application.Index)
}

func (app Application) Logout() revel.Result {
	for k := range app.Session {
		delete(app.Session, k)
	}
	return app.Redirect(Application.Index)
}
