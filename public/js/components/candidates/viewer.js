class CandidateViewerComponent {
    constructor(workspace) {
        this.workspace = workspace;
        this.mode = "view";
    }

    init() {
        this.personalForm = $$("candidatePersonalInfoForm");
        
        this.confirmButton = $$("candidateConfirmButton");
        this.confirmButton.attachEvent("onItemClick", getCandidateConfirmClickHandler(this.workspace));
        
        // this.editButton = $$("candidateEditButton");
        // this.editButton.attachEvent("onItemClick", getCandidateEditClickHandler(this.workspace));
        
        this.deleteButton = $$("candidateDeleteButton");
        this.deleteButton.attachEvent("onItemClick", getCandidateDeleteClickHandler(this.workspace));
        
        console.log("candidate viewer loaded.");
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

    clear() {
        this.personalForm.clear();
    }

    getInputData() {
        return this.personalForm.getValues();
    }

    getWebixUI() {
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
        
        let assessmentForm = {
            view: "form",
            elements: [
                {label: "Date", labelPosition: "top", view:"combo", value:"27 Aug",
                    options:["27 Aug", "13 Jul", "14 Sep", "9 Aug"]}
            ],
        }
        
        // let contactForm = {
        //     view: "form",
        //     elements: [
        //         {},
        //     ]
        // }

        let scrollableViewerPartUI = { 
            rows:[
                personalInfoForm,
                {
                    rows: [
                        {view: "label", label: "Assessment", align: "center"},
                        assessmentForm,
                    ],
                    // cols: [{ rows: [
                    //     {view: "label", label: "Contacts", align: "center"},
                    //     contactForm,
                    // ]
                    // },
                    // ],
                },
                {},
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
                        // {id: "candidateEditButton", view:"button", value:"Edit"},
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

// function getCandidateEditClickHandler(workspace) {
//     let handler = function () {
//         if (workspace.viewer.mode === "view") {
//             workspace.changeViewerMode("edit");
//         }
//     }
//     return handler;
// }