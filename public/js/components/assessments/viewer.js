class SelectBox {
    constructor(data, createDataUI, parentViewId) {
        this.data = data;
        this.createDataUI = createDataUI;
        this.parentViewId = parentViewId;
        this.selectedData = [];
        this.availableData = Array.from(data);
    }

    select(id) {
        let item = this.data.find(value => value.id === id);
        if (item) {
            this.selectedData.push(item);
            this.availableData.splice(this.availableData.indexOf(item), 1);
        }
    }

    unselect(id) {
        let item = this.data.find(value => value.id === id);
        if (item) {
            let nextItemIndex = this.availableData.length;
            for (let i = 0; i < this.availableData.length; i++) {
                if (this.availableData[i].id > id) {
                    nextItemIndex = i;
                    break;
                }
            }
            this.availableData.splice(nextItemIndex, 0, item);
            this.selectedData.splice(this.selectedData.indexOf(item), 1);
        }
    }

    getHeader() {
        let header = {
            view: "richselect", 
            options: this.availableData,
            on: {
                "onChange": (newValue, oldValue) => {
                    handleSelectChange.call(this, newValue, oldValue);
                },
            },
        }

        return header;
    }
}

class AssessmentViewerComponent {
    constructor(workspace) {
        this.workspace = workspace;
    }

    init() {
        this.dateForm = $$("assessmentDateTimeForm");

        this.confirmButton = $$("assessmentConfirmButton");
        this.confirmButton.attachEvent("onItemClick", getAssessmentConfirmClickHandler(this.workspace));
        
        // this.editButton = $$("candidateEditButton");
        // this.editButton.attachEvent("onItemClick", getCandidateEditClickHandler(this.workspace));
        
        this.deleteButton = $$("assessmentDeleteButton");
        this.deleteButton.attachEvent("onItemClick", getAssessmentDeleteClickHandler(this.workspace));

        console.log("assessment viewer loaded.");
    }

    view(assessment) {
        this.dateForm.setValues({
            date: new Date(assessment.date),
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
        this.dateForm.clear();
    }

    getInputData() {
        return this.dateForm.getValues();
    }

    getWebixUI() {
        this.candidateSelector = new SelectBox([], getCandidateCard, "candidateSelector");

        let candidateSelectorUI = {
            id:"candidateSelector",
            borderless:false,
            rows: [
                this.candidateSelector.getHeader(),
                {
                    view:"scrollview",
                    scroll:"y",
                    body:{
                        rows:[
                            
                        ]
                    },
                },
            ],
        }

        this.employeeSelector = new SelectBox(testEmployeeSelectionOptions, getEmployeeCard, "employeesSelector");

        let employeesSelectorUI = {
            id: "employeesSelector",
            borderless:false,
            rows: [
                this.employeeSelector.getHeader(),
                {
                    id:"employeeSelectorScroll",
                    view:"scrollview",
                    scroll:"y",
                    body:{
                        id:"employeeSelectorScrollBody",
                        rows:[
                            
                        ]
                    },
                },
            ],
        }

        let toolbarUI = {
            id: "assessmentsViewerToolbar",
            view: "toolbar",
            elements: [
                {view:"label", label:"Assessment info", align:"center"},
                {id: "assessmentConfirmButton", view:"button", value:"Confirm"},
                // {view:"button", value:"Edit"},
                {id: "assessmentDeleteButton", view:"button", value:"Delete"},
            ],
        }

        let dateTimeFormUI = {
            id: "assessmentDateTimeForm",
            view: "form",
            rows:[
                {name: "date", view:"datepicker", timepicker:true, label: "Date", labelPosition: "top"},
                {view:"text", label: "Time", labelPosition: "top"},
            ],
        }

        let dateTimeUI = {
            // id: "assessmentsDateTimeForm",
            rows: [
                {view: "label", label: "Date & Time", align: "center"},
                dateTimeFormUI,
            ]
        };

        let candidateResultUI = {
            view:"form",
            cols: [
                {
                    view:"textarea",
                    height:150,
                    gravity:3,
                },
                {
                    view:"toolbar",
                    gravity:1,
                    rows: [
                        {view:"button", value:"Accept"},
                        {view:"button", value:"Reject"},
                    ],
                }
            ],
        };

        let scrollableViewverPartUI = {
            rows:[
                {
                    cols:[
                        {
                            rows:[
                                dateTimeUI,
                                employeesSelectorUI,
                            ]
                        },
                        candidateSelectorUI,
                    ]
                },
                // {},
                candidateResultUI,
            ]
        }

        let viewerUI = {
            id: "assessmentsViewer",
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

function getAssessmentConfirmClickHandler(workspace) {
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

function getAssessmentDeleteClickHandler(workspace) {
    let handler = function () {
        if (workspace.viewer.mode === "view") {
            workspace.changeViewerMode("view");
            workspace.deleteCurrentAssessment();
        }
    }
    return handler;
}

let testEmployeeSelectionOptions = [
    {id:1, value:"Rudolf"},
    {id:2, value:"Jane"},
    {id:3, value:"Quentin"},
    {id:4, value:"Van-der Varden"},
];

function getCandidateCard(box, candidate) {
    let card = {
        view: "toolbar",
        elements: [
            {view: "button", value: "V", width:50},
            {view: "button", value: "U", width:50},
            {view: "button", value: "N", width:50},
            {view: "label", label: candidate.name},
            {
                view: "button", value: "-", width:50, 
                click: getUnselectClickHandler(box, candidate.id),
            },
        ]
    }

    return card
}

function getUnselectClickHandler(box, itemId) {
    let handler = function handleUnselectClick(id, event) {
        let card = $$(id).getParentView();
        card.getParentView().removeView(card);
        box.unselect(itemId);
    }
    return handler;
}

function getEmployeeCard(box, employee) {
    let card = {
        id:"card" + employee.id,
        view: "toolbar",
        elements: [
            {view: "label", label: employee.value},
            {
                view: "button", value: "-", width:50, 
                click: getUnselectClickHandler(box, employee.id),
            },
        ]
    }
    return card;
}

function getUnselectClickHandler(box, itemId) {
    let handler = function (id, event) {
        card = $$(id).getParentView();
        card.getParentView().removeView(card);
        box.unselect(itemId);
        let header = $$(box.parentViewId).getChildViews()[0];
        header.define("options", box.availableData);
    }
    return handler;
}

function handleSelectChange(newValue, oldValue) {
    if (newValue) {
        console.log($$(this.parentViewId).getChildViews());
        let header = $$(this.parentViewId).getChildViews()[0];
        header.setValue(0);
        let id = newValue;
        let newCard = this.createDataUI(this, this.data.find(value => value.id === id));
        let body = $$(this.parentViewId).getChildViews()[1].getBody();
        console.log(body);
        body.addView(newCard, 0);
        this.select(id);
        header.define("options", this.availableData);
    }
}
