class AssessmentSelectorComponent {
    constructor(workspace) {
        this.workspace = workspace;
        this.selectedId = 0;
    }

    init() {
        this.richselect = $$("candidateAssessmentSelect");
        this.list = $$("candidateAssessmentList");
        this.list.attachEvent("onSelectChange", getListSelectChangeHandler(this));
        this.richselect.attachEvent("onChange", getRichselectChangeHandler(this));
        this.deleteButton = $$("candidateAssessmentDelete");
        this.deleteButton.attachEvent("onItemClick", getCandidateAssessmentDeleteHandler(this));
        console.log("assessment selector loaded.");
    }

    setList(data) {
        this.list.clearAll();
        this.list.parse(data);
        this.list.refresh();
    }

    setOptions(data) {
        this.data = data;
        data.forEach(element => {
            element.value = element.dateTime;
        });
        this.richselect.define("options", data);
    }

    getWebixUI() {
        let assessmentListConfig = { rows: [
            {
                view: "toolbar",
                elements: [
                    {view: "button", value: "New"},
                    {id: "candidateAssessmentDelete", view: "button", value: "Delete"},
                ]
            },
            {
                id: "candidateAssessmentList",
                view: "list",
                gravity: 1,
                template: "#dateTime#",
                select: true,
                data: [],
            },
        ]
        };

        let assessmentEditorConfig = { rows: [
                {
                    id: "candidateAssessmentSelect",
                    view: "richselect",
                    gravity: 1,
                    options: [],
                },
                {},
            ]
        };

        let selectorConfig = {
            cols: [
                assessmentEditorConfig,
                assessmentListConfig,
            ]
        };

        return selectorConfig;
    }
}

function getListSelectChangeHandler(workspace) {
    let handler = function() {
        let assessmentId = workspace.list.getSelectedItem().assessmentId;
        workspace.selectedId = assessmentId;
        workspace.richselect.setValue(assessmentId);
    }

    return handler;
}

function getCandidateAssessmentDeleteHandler(workspace) {
    let handler = function() {
        let id = workspace.list.getSelectedId();
        workspace.list.remove(id);
        console.log(workspace.list.data);
    }

    return handler;
}

function getRichselectChangeHandler(workspace) {
    let handler = function(newValue, oldValue) {
        if (newValue !== workspace.selectedId) {
            let item = workspace.list.getSelectedItem();
            item.dateTime = workspace.data.find(value => value.id === newValue).dateTime;
            workspace.list.refresh();            
        }
    }

    return handler;
}