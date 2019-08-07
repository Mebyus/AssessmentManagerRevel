class EmployeeViewerComponent {
    constructor(workspace) {
        this.workspace = workspace;
        this.mode = "view";
    }

    init() {
        this.personalForm = $$("employeePersonalInfoForm");
        
        this.confirmButton = $$("employeeConfirmButton");
        this.confirmButton.attachEvent("onItemClick", getEmployeeConfirmClickHandler(this.workspace));
        
        // this.editButton = $$("employeeEditButton");
        // this.editButton.attachEvent("onItemClick", getEmployeeEditClickHandler(this.workspace));
        
        this.deleteButton = $$("employeeDeleteButton");
        this.deleteButton.attachEvent("onItemClick", getEmployeeDeleteClickHandler(this.workspace));
        
        console.log("employee viewer loaded.");
    }

    view(employee) {
        this.personalForm.setValues({
            firstName: employee.firstName,
            middleName: employee.middleName,
            lastName: employee.lastName,
        });
    }

    activateViewMode() {
        // this.confirmButton.disable();
        this.deleteButton.enable();
        // this.editButton.enable();
        // this.personalForm.disable();
    }

    activateCreateMode() {
        // this.confirmButton.enable();
        this.deleteButton.disable();
        // this.editButton.disable();
        // this.personalForm.enable();
    }

    // activateEditMode() {
    //     this.confirmButton.enable();
    //     this.deleteButton.enable();
    //     this.editButton.disable();
    //     this.personalForm.enable();
    // }

    clear() {
        this.personalForm.clear();
    }

    getInputData() {
        return this.personalForm.getValues();
    }

    getWebixUI() {
        let toolbarUI = {
            id: "employeeViewerToolbar",
            view: "toolbar",
            elements: [
                {view:"label", label:"Employee info", align:"center"},
                {id: "employeeConfirmButton", view:"button", value:"Confirm"},
                // {id: "employeeEditButton", view:"button", value:"Edit"},
                {id: "employeeDeleteButton", view:"button", value:"Delete"},
            ],
        }

        let personalInfoForm = {
            id: "employeePersonalInfoForm",
            view: "form",
            elements: [{cols:[
                {
                    rows:
                    [
                        {name: "firstName", label: "First Name", labelPosition: "top", view:"text", placeholder: "First Name"},
                        {name: "middleName", label: "Middle Name", labelPosition: "top", view:"text", placeholder: "Middle Name"},
                        {name: "lastName", label: "Last Name", labelPosition: "top", view: "text", placeholder: "Last Name"},
                    ]
                },
            ]}],
        }

        let employeeCanlendar = {
            view:"calendar",
            id:"employeeCalendar",
            date:new Date(),
            weekHeader:true,
            events:webix.Date.isHoliday,
            width:300,
            height:250
        };

        let employeeCalendarToolbar = {
            view:"toolbar",
            id:"employeeCalendarToolbar",
            rows: [
                {view:"button", value:"Assign"},
                {view:"button", value:"Dismiss"},
            ]
        }

        let scrollableViewverPartUI = {
            rows:[
                personalInfoForm,
                {},
                {
                    cols:[
                        employeeCanlendar,
                        employeeCalendarToolbar,
                        {},
                    ]
                },
            ]
        }

        let viewerUI = {
            id: "employeeViewer",
            gravity:2,
            rows: [
                toolbarUI,
                {
                    view:"scrollview",
                    scroll:"auto",
                    body: scrollableViewverPartUI,
                }
            ],
        }

        return viewerUI;
    }
}

function getEmployeeConfirmClickHandler(workspace) {
    let handler = function () {
        if (workspace.viewer.mode === "view") {
            workspace.changeViewerMode("view");
            workspace.updateFromViewerData();
        } else if (workspace.viewer.mode === "create") {
            workspace.changeViewerMode("view");
            workspace.createFromViewerData();
        }
    }
    return handler;
}

function getEmployeeDeleteClickHandler(workspace) {
    let handler = function () {
        if (workspace.viewer.mode === "view") {
            workspace.changeViewerMode("view");
            workspace.deleteCurrentEmployee();
        }
    }
    return handler;
}
