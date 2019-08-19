import {AssessmentSelectorComponent} from "./assessmentselector.js";
import {AssessmentRequester} from "../../models/assessments/requester.js";

export class EmployeeViewerComponent {
    constructor(workspace, url) {
        this.workspace = workspace;
        this.selector = new AssessmentSelectorComponent(this);
        this.model = new AssessmentRequester(url);
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
        this.selector.clear();
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
                {view:"label", label:"Employee info", align:"center"},
                {id: "employeeConfirmButton", view:"button", value:"Confirm"},
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

        // let employeeCanlendar = {
        //     view:"calendar",
        //     id:"employeeCalendar",
        //     date:new Date(),
        //     weekHeader:true,
        //     events:webix.Date.isHoliday,
        //     width:300,
        //     height:250
        // };

        // let employeeCalendarToolbar = {
        //     view:"toolbar",
        //     id:"employeeCalendarToolbar",
        //     rows: [
        //         {view:"button", value:"Assign"},
        //         {view:"button", value:"Dismiss"},
        //     ]
        // }

        let scrollableViewverPartUI = {
            rows:[
                personalInfoForm,
                {},
                {
                    rows:[
                        {view: "label", label: "Assessment", align: "center"},
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
