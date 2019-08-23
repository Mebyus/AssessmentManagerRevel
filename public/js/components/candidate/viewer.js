import {AssessmentSelectorComponent} from "./assessmentselector.js";

export class CandidateViewerComponent {
    constructor(workspace) {
        this.workspace = workspace;
        this.mode = "view";
        this.selector = new AssessmentSelectorComponent(this);
    }

    init() {
        this.selector.init();

        this.personalForm = $$("candidatePersonalInfoForm");
        
        this.confirmButton = $$("candidateConfirmButton");
        this.confirmButton.attachEvent("onItemClick", getCandidateConfirmClickHandler(this.workspace));
              
        this.deleteButton = $$("candidateDeleteButton");
        this.deleteButton.attachEvent("onItemClick", getCandidateDeleteClickHandler(this.workspace));
    }

    view(candidate) {
        this.personalForm.clearValidation();
        this.personalForm.setValues({
            firstName: candidate.firstName,
            middleName: candidate.middleName,
            lastName: candidate.lastName,
            birthDate: new Date(candidate.birthDate),
            email: candidate.email,
            phone: candidate.phone,
        });
        this.selector.setList(candidate.assessmentList);
    }

    activateViewMode() {
        this.deleteButton.enable();
    }

    activateCreateMode() {
        this.deleteButton.disable();
    }

    clear() {
        this.personalForm.clear();
        this.personalForm.clearValidation();
        this.selector.clear();
    }

    getInputData() {
        return this.personalForm.getValues();
    }

    getWebixConfig() {
        let personalInfoForm = {
            id:"candidatePersonalInfoForm",
            view: "form",
            rules:{
                "lastName":webix.rules.isNotEmpty,
                "firstName":webix.rules.isNotEmpty,
                "phone":webix.rules.isNotEmpty,
                "email":webix.rules.isEmail,
            },
            elements: [{cols:[
                {
                    rows:
                    [
                        {
                            name:"firstName", 
                            label: "Имя", 
                            labelPosition: "top", 
                            view:"text",
                            invalidMessage: "Не может быть пустым",
                        },
                        {name:"middleName", label: "Отчество", labelPosition: "top", view:"text",},
                        {
                            name:"lastName", 
                            label: "Фамилия", 
                            labelPosition: "top", 
                            view: "text",
                            invalidMessage: "Не может быть пустым",
                        },
                        {
                            name: "birthDate",
                            label: "Дата рождения",
                            labelPosition: "top", 
                            view:"datepicker", 
                        },                    
                    ]
                },
                {rows:[
                    {
                        name:"email", 
                        label: "Email", 
                        labelPosition: "top", 
                        view:"text",
                        invalidMessage: "Неверный формат",
                    },
                    {
                        name:"phone", 
                        label: "Телефон", 
                        labelPosition: "top", 
                        view:"text",
                        pattern: webix.patterns.phone,
                        invalidMessage: "Неверный формат",
                    },
                    {},
            ],
            },
            ],
            },
            ]
        }
        
        let assessmentForm = this.selector.getWebixConfig();
        
        let scrollableViewerPartUI = { 
            rows:[
                personalInfoForm,
                {
                    rows: [
                        {view: "label", label: "Собеседования", align: "center"},
                        assessmentForm,
                    ],
                },
                // {},
            ]
        }

        let viewerUI = {
            id: "candidateViewer",
            gravity:2,
            rows: [
                {
                    view: "toolbar",
                    elements: [
                        {view:"label", label:"Информация о кандидате", align:"center"},
                        {id: "candidateConfirmButton", view:"button", type:"icon", icon:"wxi-check", autowidth:true},
                        {id: "candidateDeleteButton", view:"button", type:"icon", icon:"wxi-trash", autowidth:true},
                    ] 
                },
                {
                    view:"scrollview",
                    scroll:"auto",
                    body: scrollableViewerPartUI,
                }
            ]
        }

        return viewerUI;
    }
}


function getCandidateConfirmClickHandler(workspace) {
    let handler = function () {
        if (workspace.viewer.personalForm.validate())
        {
            if (workspace.viewer.mode === "view") {
                workspace.changeViewerMode("view");
                workspace.updateFromViewerData();
            } else if (workspace.viewer.mode === "create") {
                workspace.changeViewerMode("view");
                workspace.createFromViewerData();
            }
        } else {
            webix.message({type:"error", text:"Ошибка при вводе данных"});
        }
    }
    return handler;
}

function getCandidateDeleteClickHandler(workspace) {
    let handler = function () {
        if (workspace.viewer.mode === "view") {
            workspace.changeViewerMode("view");
            workspace.deleteCurrentCandidate();
        }
    }
    return handler;
}
