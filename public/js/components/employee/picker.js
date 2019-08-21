export class EmployeePickerComponent {
    constructor(workspace) {
        this.workspace = workspace;
        this.scrollState = {x: 0, y: 0};
        this.mode = "view";
        this.newId = "";
    }

    init() {
        this.table = $$("employeeTable");
        this.table.attachEvent("onSelectChange", getEmployeeSelectChangeHandler(this.workspace));

        this.newButton = $$("newEmployeeButton");
        this.newButton.attachEvent("onItemClick", getNewEmployeeClickHandler(this.workspace));

        this.listInput = $$("EmployeeListInput");
        this.listInput.attachEvent("onChange", getSearchChangeHandler(this.workspace));
    }

    set(employees) {
        this.scrollState = this.table.getScrollState();
        this.table.clearAll();
        this.table.parse(employees);
        this.table.sort("lastName");
        if (this.table.exists(this.workspace.currentEmployeeId)) {
            this.table.select(this.workspace.currentEmployeeId);
        }
        this.table.scrollTo(this.scrollState.x, this.scrollState.y);
        this.table.refresh();
    }

    activateNewMode() {
        this.mode = "new";
        this.newButton.disable();
    }

    activateViewMode() {
        this.mode = "view";
        this.newButton.enable();
    }

    getWebixConfig() {
        let tableToolbar = {
            id: "employeeTableToolbar",
            view: "toolbar",
            elements: [
                {id: "newEmployeeButton", view:"button", type:"icon", icon:"wxi-plus", autowidth:true},
                {id: "EmployeeSyncButton", view:"button", type:"icon", 
                icon:"wxi-sync", autowidth: true},
                {id: "EmployeeListInput", view:"search", placeholder:"Найти...", gravity: 2},
            ]
        }
        
        let table = {
            id: "employeeTable",
            view: "datatable",
            columns: [
                {id:"lastName", header:"Фамилия", fillspace:true},
                {id:"firstName", header:"Имя", fillspace:true},
                {id:"middleName", header:"Отчество", fillspace:true},
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
        let item = workspace.picker.table.getSelectedItem();
        if (item) {
            if (item.id !== workspace.picker.newId) {
                workspace.changeViewerMode("view");
                if (workspace.picker.table.exists(workspace.picker.newId)) {
                    workspace.picker.table.remove(workspace.picker.newId);
                }
                workspace.viewEmployee(item.id);
                workspace.picker.activateViewMode();    
            }   
        }
    }
    return handler;
}

// function getListInputHandler(workspace) {
//     let handler = function() {
//         let value = workspace.listInput.getValue().toLowerCase();
//         workspace.table.filter(function(item) {
//             if (item.id !== workspace.newId) {
//                 return item.lastName.toLowerCase().indexOf(value) !== -1;            
//             } else {
//                 return true;
//             }
//         });
//     }
//     return handler;
// }

function getSearchChangeHandler(workspace) {
    let handler = function(newValue, oldValue) {
        let value = newValue.toLowerCase();
        workspace.search(value);
    }
    return handler;
}

function getNewEmployeeClickHandler(workspace) {
    let handler = function () {
        workspace.changeViewerMode("create");
        workspace.picker.activateNewMode();
        workspace.picker.newId = workspace.picker.table.add({}, 0);
        workspace.picker.table.select(workspace.picker.newId);
        workspace.picker.table.scrollTo(0, 0);
    }
    return handler;
}