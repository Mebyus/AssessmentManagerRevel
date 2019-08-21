package mappers

import (
	"AssessmentManager/app/structures"
	"fmt"
)

type UserMapper struct {
	Mapper
}

func (mapper *UserMapper) GetUser(username string) (*structures.User, error) {
	user := structures.User{}

	query := "SELECT name, username, hashed_password " +
		"FROM user_data WHERE username = $1;"

	row := mapper.connection.QueryRow(query, username)
	err := row.Scan(&user.Name, &user.Username, &user.HashedPassword)
	if err != nil {
		return nil, fmt.Errorf("Получение данных пользователя из БД:\n", err)
	}

	return &user, nil
}

func (mapper *UserMapper) SaveUser(user *structures.User) (error) {
	query := "INSERT INTO user_data(name, username, hashed_password) " +
		"VALUES ($1, $2, $3)"
	_, err := mapper.connection.Exec(query, user.Name, user.Username, user.HashedPassword)
	if err != nil {
		return fmt.Errorf("Добавление пользователя в БД:\n", err)
	}
	return nil
}
