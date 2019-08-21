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
        this.selector.clear();
    }

    getInputData() {
        return this.personalForm.getValues();
    }

    getWebixConfig() {
        let personalInfoForm = {
            id:"candidatePersonalInfoForm",
            view: "form",
            elements: [{cols:[
                {
                    rows:
                    [
                        {name:"firstName", label: "Имя", labelPosition: "top", view:"text",},
                        {name:"middleName", label: "Отчество", labelPosition: "top", view:"text",},
                        {name:"lastName", label: "Фамилия", labelPosition: "top", view: "text",},
                        {
                            name: "birthDate",
                            label: "Дата рождения",
                            labelPosition: "top", 
                            view:"datepicker", 
                        },                    
                    ]
                },
                {rows:[
                    {name:"email", label: "Email", labelPosition: "top", view:"text",},
                    {name:"phone", label: "Телефон", labelPosition: "top", view:"text",},
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
                        {id: "candidateConfirmButton", view:"button", type:"icon", icon:"wxi-check", autowidth:true},
                        {id: "candidateDeleteButton", view:"button", type:"icon", icon:"wxi-trash", autowidth:true},
                        {view:"label", label:"Информация о кандидате", align:"center"},
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

function getCandidateDeleteClickHandler(workspace) {
    let handler = function () {
        if (workspace.viewer.mode === "view") {
            workspace.changeViewerMode("view");
            workspace.deleteCurrentCandidate();
        }
    }
    return handler;
}
