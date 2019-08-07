class AssessmentPickerComponent {
    constructor(workspace) {
        this.workspace = workspace;
    }

    init() {
        this.table = $$("assessmentTable");
        this.table.attachEvent("onSelectChange", getAssessmentSelectChangeHandler(this.workspace));

        this.newButton = $$("newAssessmentButton");
        this.newButton.attachEvent("onItemClick", getNewAssessmentClickHandler(this.workspace));
        
        console.log("assessment picker loaded.");
    }

    set(assessments) {
        this.table.clearAll();
        this.table.parse(assessments);
        this.table.refresh();
    }

    getWebixUI() {
        let tableToolbar = {
            id: "assessmentTableToolbar",
            view: "toolbar",
            elements: [
                {id: "newAssessmentButton", view:"button", value: "New"},
            ]
        }
        
        let table = {
            id: "assessmentTable",
            view: "datatable",
            columns: [
                {id:"date", header:"Date", fillspace:true},
                {id:"numberOfCandidates", header:"Candidates", minWidth:60},
                {id:"numberOfEmployees", header:"Employees", fillspace:true}
            ],
            select: true,
            data: [],
        }

        let assessmentPickerUI = {
            id: "assessmentPicker",
            gravity: 1,
            rows: [
                tableToolbar,
                table,
            ]
        }

        return assessmentPickerUI;
    }
}

function getAssessmentSelectChangeHandler(workspace) {
    let handler = function () {
        workspace.changeViewerMode("view");
        let item = workspace.picker.table.getSelectedItem();
        if (item) {
            workspace.viewAssessment(item.id);
        }
    }
    return handler;
}

function getNewAssessmentClickHandler(workspace) {
    let handler = function () {
        workspace.changeViewerMode("create");
    }
    return handler;
}
