package providers

import (
	"database/sql"
	"errors"
	"fmt"
	_ "github.com/lib/pq"
)

// Реализация основных методов провайдера: инициализация, создание соединения,
// закрытие соединения.
type Provider struct {
	connection *sql.DB
}

// Provider.Init метод для инициализации провайдера. Создает соединение с БД приложения.
func (provider *Provider) Init() (error) {
	err := provider.Connect("postgres", "lfqljcneg", "assessment_manager_db")
	if err != nil {
		return fmt.Errorf("Инициализация провайдера: %v", err)
	}
	return nil
}

// Provider.Connect метод для создания соединения с произвольной конфигурацией.
func (provider *Provider) Connect(user string, password string, dbName string) (error) {
	var err error

	if provider.connection != nil {
		return errors.New("Создание соединения с БД: Ошибка: Соединение уже существует.")
	}

	connectionString := "user=" + user +
						" password=" + password +
						" dbname=" + dbName +
						" sslmode=disable"

	provider.connection, err = sql.Open("postgres", connectionString)
	if err != nil {
		return fmt.Errorf("Создание соединения с БД: ", err)
	}
	return nil
}

// Provider.Disconnect метод закрывающий соединение провайдера с БД.
func (provider *Provider) Disconnect() (error) {
	if provider.connection == nil {
		return errors.New("Закрытие соединения с БД: Ошибка: Соединение отсутствует.")
	}
	return provider.connection.Close()
}
