package mappers

import (
	"database/sql"
	"strconv"
	"strings"
	"reflect"
)

type Mapper struct {
	connection *sql.DB
}

func (mapper *Mapper) Connect(connection *sql.DB) (error) {
	mapper.connection = connection
	return nil
}

func tagValue(tag string, valuePtr interface{}) []interface{} {
	value := reflect.ValueOf(valuePtr).Elem()
	valueType := value.Type()
	var valList []interface{}
	for i := 0; i < valueType.NumField(); i++ {
		_, ok := valueType.Field(i).Tag.Lookup(tag)
		if ok {
			field := value.Field(i)
			valList = append(valList, field.Interface())
		}
	}
	return valList
}

//Пример: tagSubstStr("extag", structVal) => "field_a = $1, field_b = $2, field_c = $3"
func tagSubstStr(tag string, value interface{}) (string, int) {
	var substList []string
	valueType := reflect.TypeOf(value)
	tagFieldNum := 0
	for i := 0; i < valueType.NumField(); i++ {
		name, ok := valueType.Field(i).Tag.Lookup(tag)
		if ok {
			tagFieldNum++;
			substList = append(substList, name + " = $" + strconv.Itoa(tagFieldNum))
		}
	}
	return strings.Join(substList, ", "), tagFieldNum
}

// SubstStr возвращает строку для подстановки значний при вызове
// query INSERT.
//
// Пример: substStr(4, "$") => "($1, $2, $3, $4)"
func substStr(count int, specialSymbol string) (string) {
	var strList  []string
	for i := 1; i <= count; i++{
		strList = append(strList, specialSymbol + strconv.Itoa(i))
	}
	return "(" + strings.Join(strList, ", ") + ")"
}

// TagString возвращает строку со списком полей структуры отмеченных
// тегом, при этом поля переименовываются в соответствии со значением
// тега в дескрипторе.
//
// Пример: TagString("extag", structVar) => "fieldA, fieldB, fieldG, fieldQ"
func tagString(tag string, value interface{}) (string, int) {
	var nameList []string
	valueType := reflect.TypeOf(value)
	tagFieldNum := 0
	for i := 0; i < valueType.NumField(); i++ {
		name, ok := valueType.Field(i).Tag.Lookup(tag)
		if ok {
			tagFieldNum++;
			nameList = append(nameList, name)
		}
	}
	return strings.Join(nameList, ", "), tagFieldNum
}

// TagPtr возвращает срез ссылок на поля структуры отмеченные
// в дескрипторе тегом.
// valuePtr - указатель на структуру.
func tagPtr(tag string, valuePtr interface{}) ([]interface{}) {
	value := reflect.ValueOf(valuePtr).Elem()
	valueType := value.Type()
	var ptrList []interface{}
	for i := 0; i < valueType.NumField(); i++ {
		_, ok := valueType.Field(i).Tag.Lookup(tag)
		if ok {
			field := value.Field(i)
			ptrList = append(ptrList, field.Addr().Interface())
		}
	}
	return ptrList
}
