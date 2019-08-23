package controllers

import "github.com/revel/revel"

func init() {
	//revel.InterceptMethod(LoginController.AddUser, revel.BEFORE)
	revel.InterceptMethod(ApplicationController.checkUser, revel.BEFORE)
}