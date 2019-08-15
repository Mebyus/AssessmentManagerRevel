export class EmployeePickerComponent {
    constructor(workspace) {
        this.workspace = workspace;
    }

    init() {
        this.table = $$("employeeTable");
        this.table.attachEvent("onSelectChange", getEmployeeSelectChangeHandler(this.workspace));

        this.newButton = $$("newEmployeeButton");
        this.newButton.attachEvent("onItemClick", getNewEmployeeClickHandler(this.workspace));
        console.log("employee picker loaded.");
    }

    set(employees) {
        this.table.clearAll();
        this.table.parse(employees);
        this.table.refresh();
    }

    getWebixConfig() {
        let tableToolbar = {
            id: "employeeTableToolbar",
            view: "toolbar",
            elements: [
                {id: "newEmployeeButton", view:"button", value: "New"},
            ]
        }
        
        let table = {
            id: "employeeTable",
            view: "datatable",
            columns: [
                {id:"id", header:"id", minWidth:60},
                {id:"firstName", header:"First Name", fillspace:true},
                {id:"middleName", header:"Middle Name", fillspace:true},
                {id:"lastName", header:"Last Name", fillspace:true},
            ],
            select: true,
            data: [],
        }

        let employeePickerUI = {
            id: "employeePicker",
            gravity: 1,
            rows: [
                tableToolbar,
                table,
            ]
        }

        return employeePickerUI;
    }
}

function getEmployeeSelectChangeHandler(workspace) {
    let handler = function () {
        workspace.changeViewerMode("view");
        let item = workspace.picker.table.getSelectedItem();
        if (item) {
            workspace.viewEmployee(item.id);
        }
    }
    return handler;
}


function getNewEmployeeClickHandler(workspace) {
    let handler = function () {
        workspace.changeViewerMode("create");
    }
    return handler;
}