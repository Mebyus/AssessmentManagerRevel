export class AssessmentSelectorComponent {
    constructor(workspace) {
        this.workspace = workspace;
        this.currentEmployeeId = "";
        this.selectedId = "";
        this.newId = "";
        this.mode = "empty";
    }

    init() {
        this.list = $$("EmployeeAssessmentList");
        this.list.attachEvent("onSelectChange", getListSelectChangeHandler(this));

        this.richselect = $$("EmployeeAssessmentSelect");
        this.richselect.attachEvent("onChange", getRichSelectChangeHandler(this));

        this.deleteButton = $$("EmployeeAssessmentDelete");
        this.deleteButton.attachEvent("onItemClick", getDeleteHandler(this));

        this.newButton = $$("EmployeeAssessmentNew");
        this.newButton.attachEvent("onItemClick", getNewHandler(this));

        this.activateEmptyMode();
    }

    clear() {
        this.richselect.setValue("");
        this.list.clearAll();
    }

    activateEmptyMode() {
        this.mode = "empty";
        this.richselect.disable();
        this.newButton.enable();
        this.deleteButton.disable();
    }

    activateNewMode() {
        this.mode = "new";
        this.richselect.enable();
        this.newButton.disable();
        this.deleteButton.enable();
    }

    activateEditMode() {
        this.mode = "edit";
        this.richselect.enable();
        this.newButton.enable();
        this.deleteButton.enable();
    }

    setList(data) {
        this.list.clearAll();
        this.list.parse(data);
        this.list.refresh();
    }

    getInputData() {
        if (this.mode === "new") {
            this.list.remove(this.newId);
        }
        return this.list.serialize();
    }

    setOptions(data) {
        this.data = data;
        data.forEach(element => {
            element.value = element.dateTime;
        });
        this.richselect.define("options", data);
        this.richselect.setValue("");
    }

    getWebixConfig() {
        let employeeListConfig = { rows: [
            {
                view: "toolbar",
                elements: [
                    {id: "EmployeeAssessmentNew", view: "button", value: "Добавить"},
                    {id: "EmployeeAssessmentDelete", view: "button", value: "Убрать"},
                ]
            },
            {
                id: "EmployeeAssessmentList",
                view: "list",
                gravity: 1,
                template: "#dateTime#",
                select: true,
                data: [],
            },
        ]
        };

        let employeeEditorConfig = { rows: [
                {
                    id: "EmployeeAssessmentSelect",
                    view: "richselect",
                    placeholder: "Выберите собеседование",
                    gravity: 1,
                    options: [],
                },
                {},
            ]
        };

        let selectorConfig = {
            minHeight: 250,
            cols: [
                employeeEditorConfig,
                employeeListConfig,
            ]
        };

        return selectorConfig;
    }
}

function getListSelectChangeHandler(workspace) {
    let handler = function() {
        let itemId = workspace.list.getSelectedId();
        if (itemId !== workspace.newId) {
            workspace.activateEditMode();
            let assessmentId = workspace.list.getSelectedItem().assessmentId;
            workspace.list.remove(workspace.newId);
            workspace.selectedId = assessmentId;
            workspace.richselect.setValue(assessmentId);
        }
    }

    return handler;
}

function getDeleteHandler(workspace) {
    let handler = function() {
        let id = workspace.list.getSelectedId();
        workspace.list.moveSelection("up");
        workspace.list.remove(id);
        if (workspace.list.count() === 0) {
            workspace.activateEmptyMode();
        }
    }

    return handler;
}

function getNewHandler(workspace) {
    let handler = function() {
        workspace.activateNewMode();
        workspace.newId = workspace.list.add({dateTime:"Выберите дату..."});
        workspace.list.select(workspace.newId);
        workspace.selectedId = "";
        workspace.richselect.setValue("");
    }

    return handler;
}

function getRichSelectChangeHandler(workspace) {
    let handler = function(newValue, oldValue) {
        if (newValue !== workspace.selectedId) {
            let item = workspace.list.getSelectedItem();
            let assessment = workspace.data.find(value => value.id === newValue);
            if (item && assessment) {
                item.dateTime = assessment.dateTime;
                item.assessmentId = parseInt(assessment.id);
                item.employeeId = parseInt(workspace.currentEmployeeId);
                workspace.list.refresh();
                if (workspace.mode === "new") {
                    workspace.activateEditMode();
                    workspace.newId = "";
                }
            }
        }
    }

    return handler;
}