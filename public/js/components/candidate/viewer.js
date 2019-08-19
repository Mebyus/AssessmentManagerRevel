import {AssessmentSelectorComponent} from "./assessmentselector.js";
import {AssessmentRequester} from "./../../models/assessments/requester.js";

export class CandidateViewerComponent {
    constructor(workspace, url) {
        this.workspace = workspace;
        this.mode = "view";
        this.selector = new AssessmentSelectorComponent(this);
        this.model = new AssessmentRequester(url);
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
        let personalInfoForm = {
            id:"candidatePersonalInfoForm",
            view: "form",
            elements: [{cols:[
                {
                    rows:
                    [
                        {name:"firstName", label: "First Name", labelPosition: "top", view:"text", placeholder: "First Name"},
                        {name:"middleName", label: "Middle Name", labelPosition: "top", view:"text", placeholder: "Middle Name"},
                        {name:"lastName", label: "Last Name", labelPosition: "top", view: "text", placeholder: "Last Name"},
                        {
                            name: "birthDate",
                            label: "Birthdate",
                            labelPosition: "top", 
                            view:"datepicker", 
                            value: new Date(), 
                        },                    
                    ]
                },
                {rows:[
                    {name:"email", label: "Email", labelPosition: "top", view:"text", placeholder: "myawesome@randommail.com"},
                    {name:"phone", label: "Phone", labelPosition: "top", view:"text", placeholder: "+7 931 284 30 31"},
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
                        {view: "label", label: "Assessment", align: "center"},
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
                        {view:"label", label:"Candidate info", align:"center"},
                        {id: "candidateConfirmButton", view:"button", value:"Confirm"},
                        {id: "candidateDeleteButton", view:"button", value:"Delete"},
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
