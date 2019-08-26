package controllers

import "github.com/revel/revel"

func init() {
	revel.InterceptMethod(EmployeeController.checkUser, revel.BEFORE)
	revel.InterceptMethod(AssessmentController.checkUser, revel.BEFORE)
	revel.InterceptMethod(CandidateController.checkUser, revel.BEFORE)
	revel.InterceptMethod(ApplicationController.checkUser, revel.BEFORE)
}