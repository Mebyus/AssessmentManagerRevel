let employeeTestData = [
    {"id":1,"firstName":"Vinni","middleName":"Colline","lastName":"Danilovic"},
    {"id":2,"firstName":"Jamie","middleName":"Margette","lastName":"Mugleston"},
    {"id":3,"firstName":"Maribel","middleName":"Eli","lastName":"Mensler"},
    {"id":4,"firstName":"Rosa","middleName":"Arnoldo","lastName":"Gribbin"},
    {"id":5,"firstName":"Nadine","middleName":"Cully","lastName":"Constance"},
    {"id":6,"firstName":"Uta","middleName":"Westleigh","lastName":"Chitter"},
    {"id":7,"firstName":"Lexine","middleName":"Virgie","lastName":"Devitt"},
    {"id":8,"firstName":"Markos","middleName":"Donavon","lastName":"Maps"},
    {"id":9,"firstName":"Mathias","middleName":"Arin","lastName":"Blinder"},
    {"id":10,"firstName":"Sebastiano","middleName":"Erik","lastName":"Aleksandrev"},
    {"id":11,"firstName":"Blinnie","middleName":"Lana","lastName":"Morecombe"},
    {"id":12,"firstName":"Ricki","middleName":"Saxe","lastName":"Goldberg"},
    {"id":13,"firstName":"Laurel","middleName":"Allys","lastName":"Guierre"},
    {"id":14,"firstName":"Aharon","middleName":"Lezley","lastName":"Petkens"},
    {"id":15,"firstName":"Ardith","middleName":"Pet","lastName":"Quadling"},
    {"id":16,"firstName":"Norton","middleName":"Lettie","lastName":"Crossley"},
    {"id":17,"firstName":"Olivia","middleName":"Gladi","lastName":"Hillen"},
    {"id":18,"firstName":"Rubi","middleName":"Skye","lastName":"Lavrinov"},
    {"id":19,"firstName":"Burg","middleName":"Charis","lastName":"Flannigan"},
    {"id":20,"firstName":"Margit","middleName":"Artur","lastName":"Gulley"},
    {"id":21,"firstName":"Cecily","middleName":"Davide","lastName":"Wayland"},
    {"id":22,"firstName":"Lonnie","middleName":"Augustina","lastName":"Heinel"},
    {"id":23,"firstName":"Demetris","middleName":"Abbi","lastName":"Adamovitz"},
    {"id":24,"firstName":"Roi","middleName":"Ernesto","lastName":"Masters"},
    {"id":25,"firstName":"Ricki","middleName":"Clarke","lastName":"Jeannon"},
    {"id":26,"firstName":"Hadrian","middleName":"Zarla","lastName":"Moatt"},
    {"id":27,"firstName":"Sissy","middleName":"Paolo","lastName":"Nealy"},
    {"id":28,"firstName":"Grange","middleName":"Jethro","lastName":"Kenwood"},
    {"id":29,"firstName":"Berne","middleName":"Haskell","lastName":"Kee"},
    {"id":30,"firstName":"Darlleen","middleName":"Mannie","lastName":"Gerge"}
];

let nextEmployeeId = employeeTestData.length + 1;

class EmployeeProvider {
    constructor() {

    }

    get(id) {
        return employeeTestData.find(value => value.id === id);
    }

    add(employee) {
        employee.id = nextEmployeeId;
        nextEmployeeId++;
        employeeTestData.push(employee);
    }

    update(id, employee) {
        employee.id = id;
        employeeTestData.every(function(item, index, array) {
            if (item.id === id) {
                array.splice(index, 1, employee);
                return false;
            }
            return true;
        });
    }

    delete(id) {
        employeeTestData.every(function(item, index, array) {
            if (item.id === id) {
                array.splice(index, 1);
                return false;
            }
            return true;
        });
    }

    getAll() {
        return employeeTestData;
    }
}