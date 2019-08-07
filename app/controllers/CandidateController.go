package controllers

import (
	"AssessmentManager/app/structures"
	"github.com/revel/revel"
)

type CandidatesController struct {
	*revel.Controller
}

func (controller *CandidatesController) Get() revel.Result {

}

func (controller *CandidatesController) GetById() revel.Result {
	controller.Response.Status = 200
	can := structures.Candidate{
		10,
		"Paul",
		"Paul",
		"Paul",
		22,
		"+7456",
		"ee@mail.com",
	}
	return controller.RenderJSON(can)
}

func (controller *CandidatesController) Create() revel.Result {

}

func (controller *CandidatesController) Delete() revel.Result {

}

func (controller *CandidatesController) Update() revel.Result {

}
