package providers

import (
	"AssessmentManager/app/structures"
	"AssessmentManager/app/mappers"
)

// Провайдер для передачи запроса от CandidateController к мапперу
type CandidateProvider struct {
	Provider
	mapper *mappers.CandidateMapper
}

// CandidateProvider.Get передает запрос GET /candidate мапперу
func (provider *CandidateProvider) Get() (*[]structures.Candidate, error) {
	provider.mapper = new(mappers.CandidateMapper)
	provider.mapper.Connection = provider.connection
	return provider.mapper.Get()
}

// CandidateProvider.GetById передает запрос GET /candidate/:id мапперу
func (provider *CandidateProvider) GetById(id string) (*structures.Candidate, error) {
	provider.mapper = new(mappers.CandidateMapper)
	provider.mapper.Connection = provider.connection
	return provider.mapper.GetById(id)
}

// CandidateProvider.Create передает запрос PUT /candidate мапперу
func (provider *CandidateProvider) Create(candidate *structures.Candidate) (*structures.Candidate, error){
	provider.mapper = &mappers.CandidateMapper{}
	provider.mapper.Connection = provider.connection
	return provider.mapper.Create(candidate)
}

// CandidateProvider.Update передает запрос POST /candidate/:id мапперу
func (provider *CandidateProvider) Update(candidate *structures.Candidate) (*structures.Candidate, error){
	provider.mapper = &mappers.CandidateMapper{}
	provider.mapper.Connection = provider.connection
	return provider.mapper.Update(candidate)
}

// CandidateProvider.Delete передает запрос DELETE /candidate/:id мапперу
func (provider *CandidateProvider) Delete(id string) (error) {
	provider.mapper = &mappers.CandidateMapper{}
	provider.mapper.Connection = provider.connection
	return provider.mapper.Delete(id)
}