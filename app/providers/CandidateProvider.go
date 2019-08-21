package providers

import (
	"AssessmentManager/app/structures"
	"AssessmentManager/app/mappers"
	"fmt"
)

// Провайдер для передачи запроса от CandidateController к мапперу
type CandidateProvider struct {
	Provider
	mapper *mappers.CandidateMapper
}

// CandidateProvider.GetById передает запрос GET /candidate/:id мапперу
func (provider *CandidateProvider) Search(searchStr string) (*[]structures.Candidate, error) {
	provider.mapper = &mappers.CandidateMapper{}
	err := provider.mapper.Connect(provider.connection)
	if err != nil {
		return nil, fmt.Errorf("Создание соединения маппера с БД:", err)
	}
	return provider.mapper.Search(searchStr)
}

// CandidateProvider.Get передает запрос GET /candidate мапперу
func (provider *CandidateProvider) Get() (*[]structures.Candidate, error) {
	provider.mapper = &mappers.CandidateMapper{}
	err := provider.mapper.Connect(provider.connection)
	if err != nil {
		return nil, fmt.Errorf("Создание соединения маппера с БД:", err)
	}
	return provider.mapper.Get()
}

// CandidateProvider.GetById передает запрос GET /candidate/:id мапперу
func (provider *CandidateProvider) GetById(id string) (*structures.Candidate, error) {
	provider.mapper = &mappers.CandidateMapper{}
	err := provider.mapper.Connect(provider.connection)
	if err != nil {
		return nil, fmt.Errorf("Создание соединения маппера с БД:", err)
	}
	return provider.mapper.GetById(id)
}

// CandidateProvider.Create передает запрос PUT /candidate мапперу
func (provider *CandidateProvider) Create(candidate *structures.Candidate) (*structures.Candidate, error){
	provider.mapper = &mappers.CandidateMapper{}
	err := provider.mapper.Connect(provider.connection)
	if err != nil {
		return nil, fmt.Errorf("Создание соединения маппера с БД:", err)
	}
	return provider.mapper.Create(candidate)
}

// CandidateProvider.Update передает запрос POST /candidate/:id мапперу
func (provider *CandidateProvider) Update(candidate *structures.Candidate) (*structures.Candidate, error){
	provider.mapper = &mappers.CandidateMapper{}
	err := provider.mapper.Connect(provider.connection)
	if err != nil {
		return nil, fmt.Errorf("Создание соединения маппера с БД:", err)
	}
	return provider.mapper.Update(candidate)
}

// CandidateProvider.Delete передает запрос DELETE /candidate/:id мапперу
func (provider *CandidateProvider) Delete(id string) (error) {
	provider.mapper = &mappers.CandidateMapper{}
	err := provider.mapper.Connect(provider.connection)
	if err != nil {
		return fmt.Errorf("Создание соединения маппера с БД:", err)
	}
	return provider.mapper.Delete(id)
}