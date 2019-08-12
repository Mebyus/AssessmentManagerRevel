package providers

import (
	"AssessmentManager/app/mappers"
	"AssessmentManager/app/structures"
	"fmt"
)

type EmployeeProvider struct {
	Provider
	mapper *mappers.EmployeeMapper
}

// EmployeeProvider.Get передает запрос GET /employee мапперу
func (provider *EmployeeProvider) Get() (*[]structures.Employee, error) {
	provider.mapper = &mappers.EmployeeMapper{}
	err := provider.mapper.Connect(provider.connection)
	if err != nil {
		return nil, fmt.Errorf("Создание соединения маппера с БД:", err)
	}
	return provider.mapper.Get()
}

// EmployeeProvider.GetById передает запрос GET /employee/:id мапперу
func (provider *EmployeeProvider) GetById(id string) (*structures.Employee, error) {
	provider.mapper = &mappers.EmployeeMapper{}
	err := provider.mapper.Connect(provider.connection)
	if err != nil {
		return nil, fmt.Errorf("Создание соединения маппера с БД:", err)
	}
	return provider.mapper.GetById(id)
}

// EmployeeProvider.Create передает запрос PUT /employee мапперу
func (provider *EmployeeProvider) Create(employee *structures.Employee) (*structures.Employee, error){
	provider.mapper = &mappers.EmployeeMapper{}
	err := provider.mapper.Connect(provider.connection)
	if err != nil {
		return nil, fmt.Errorf("Создание соединения маппера с БД:", err)
	}
	return provider.mapper.Create(employee)
}

// EmployeeProvider.Delete передает запрос DELETE /employee/:id мапперу
func (provider *EmployeeProvider) Delete(id string) (error) {
	provider.mapper = &mappers.EmployeeMapper{}
	err := provider.mapper.Connect(provider.connection)
	if err != nil {
		return fmt.Errorf("Создание соединения маппера с БД:", err)
	}
	return provider.mapper.Delete(id)
}

// EmployeeProvider.Update передает запрос POST /employee/:id мапперу
func (provider *EmployeeProvider) Update(employee *structures.Employee) (*structures.Employee, error){
	provider.mapper = &mappers.EmployeeMapper{}
	err := provider.mapper.Connect(provider.connection)
	if err != nil {
		return nil, fmt.Errorf("Создание соединения маппера с БД:", err)
	}
	return provider.mapper.Update(employee)
}