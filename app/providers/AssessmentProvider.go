package providers

import (
	"AssessmentManager/app/mappers"
	"AssessmentManager/app/structures"
)

type AssessmentProvider struct {
	Provider
	mapper *mappers.AssessmentMapper
}

// AssessmentProvider.Get передает запрос GET /assessment мапперу
func (provider *AssessmentProvider) Search(dateRange *structures.DateRange) (*[]structures.Assessment, error) {
	provider.mapper = &mappers.AssessmentMapper{}
	err := provider.mapper.Init(provider.connection)
	if err != nil {
		return nil, err
	}
	return provider.mapper.Search(dateRange)
}

// AssessmentProvider.Get передает запрос GET /assessment мапперу
func (provider *AssessmentProvider) Get() (*[]structures.Assessment, error) {
	provider.mapper = &mappers.AssessmentMapper{}
	err := provider.mapper.Init(provider.connection)
	if err != nil {
		return nil, err
	}
	return provider.mapper.Get()
}

// AssessmentProvider.GetById передает запрос GET /assessment/:id мапперу
func (provider *AssessmentProvider) GetById(id string) (*structures.Assessment, error) {
	provider.mapper = &mappers.AssessmentMapper{}
	err := provider.mapper.Init(provider.connection)
	if err != nil {
		return nil, err
	}
	return provider.mapper.GetById(id)
}

// AssessmentProvider.Create передает запрос PUT /assessment мапперу
func (provider *AssessmentProvider) Create(assessment *structures.Assessment) (*structures.Assessment, error){
	provider.mapper = &mappers.AssessmentMapper{}
	err := provider.mapper.Init(provider.connection)
	if err != nil {
		return nil, err
	}
	return provider.mapper.Create(assessment)
}

// AssessmentProvider.Delete передает запрос DELETE /assessment/:id мапперу
func (provider *AssessmentProvider) Delete(id string) (error) {
	provider.mapper = &mappers.AssessmentMapper{}
	err := provider.mapper.Init(provider.connection)
	if err != nil {
		return err
	}
	return provider.mapper.Delete(id)
}

// AssessmentProvider.Update передает запрос POST /assessment/:id мапперу
func (provider *AssessmentProvider) Update(assessment *structures.Assessment) (*structures.Assessment, error){
	provider.mapper = &mappers.AssessmentMapper{}
	err := provider.mapper.Init(provider.connection)
	if err != nil {
		return nil, err
	}
	return provider.mapper.Update(assessment)
}