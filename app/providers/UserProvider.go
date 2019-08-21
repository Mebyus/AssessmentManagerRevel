package providers

import (
	"AssessmentManager/app/structures"
	"AssessmentManager/app/mappers"
	"fmt"
)

type UserProvider struct {
	Provider
	mapper *mappers.UserMapper
}

func (provider *UserProvider) GetUser(username string) (*structures.User, error) {
	provider.mapper = &mappers.UserMapper{}
	err := provider.mapper.Connect(provider.connection)
	if err != nil {
		return nil, fmt.Errorf("Создание соединения маппера с БД:", err)
	}
	return provider.mapper.GetUser(username)
}

func (provider *UserProvider) SaveUser(user *structures.User) (error) {
	provider.mapper = &mappers.UserMapper{}
	err := provider.mapper.Connect(provider.connection)
	if err != nil {
		return fmt.Errorf("Создание соединения маппера с БД:", err)
	}
	return provider.mapper.SaveUser(user)
}
