import {AssessmentSelectorComponent} from "./assessmentselector.js";

export class EmployeeViewerComponent {
    constructor(workspace) {
        this.workspace = workspace;
        this.selector = new AssessmentSelectorComponent(this);
        this.mode = "view";
    }

    init() {
        this.selector.init();

        this.personalForm = $$("employeePersonalInfoForm");
        
        this.confirmButton = $$("employeeConfirmButton");
        this.confirmButton.attachEvent("onItemClick", getEmployeeConfirmClickHandler(this.workspace));
        
        this.deleteButton = $$("employeeDeleteButton");
        this.deleteButton.attachEvent("onItemClick", getEmployeeDeleteClickHandler(this.workspace));
    }

    view(employee) {
        this.personalForm.setValues({
            firstName: employee.firstName,
            middleName: employee.middleName,
            lastName: employee.lastName,
        });
        this.selector.setList(employee.assessmentList);
    }

    activateViewMode() {
        this.deleteButton.enable();
    }

    activateCreateMode() {
        this.deleteButton.disable();
    }

    clear() {
        this.personalForm.clear();
        this.selector.clear();
    }

    getInputData() {
        return this.personalForm.getValues();
    }

    getWebixConfig() {
        let toolbarUI = {
            id: "employeeViewerToolbar",
            view: "toolbar",
            elements: [
                {view:"label", label:"Информация о сотруднике", align:"center"},
                {id: "employeeConfirmButton", view:"button", type:"icon", icon:"wxi-check", autowidth:true},
                {id: "employeeDeleteButton", view:"button", type:"icon", icon:"wxi-trash", autowidth:true},
            ],
        }

        let personalInfoForm = {
            id: "employeePersonalInfoForm",
            view: "form",
            elements: [{cols:[
                {
                    rows:
                    [
                        {name: "firstName", label: "Имя", labelPosition: "top", view:"text",},
                        {name: "middleName", label: "Отчество", labelPosition: "top", view:"text",},
                        {name: "lastName", label: "Фамилия", labelPosition: "top", view: "text",},
                    ]
                },
            ]}],
        }

        let scrollableViewverPartUI = {
            rows:[
                personalInfoForm,
                {},
                {
                    rows:[
                        {view: "label", label: "Собеседования", align: "center"},
                        this.selector.getWebixConfig(),
                    ],
                }
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
