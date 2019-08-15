export class EmployeeAssessmentSelectorComponent {
    constructor(workspace) {
        this.workspace = workspace;
        this.currentEmployeeId = -1;
        this.selectedId = -1;
        this.newId = -1;
        this.mode = "empty";
    }

    init() {
        this.richselect = $$("candidateAssessmentSelect");
        this.list = $$("candidateAssessmentList");
        this.list.attachEvent("onSelectChange", getListSelectChangeHandler(this));
        this.richselect.attachEvent("onChange", getRichselectChangeHandler(this));

        this.deleteButton = $$("candidateAssessmentDelete");
        this.deleteButton.attachEvent("onItemClick", getCandidateAssessmentDeleteHandler(this));

        this.newButton = $$("candidateAssessmentNew");
        this.newButton.attachEvent("onItemClick", getCandidateAssessmentNewHandler(this));

        this.datepicker = $$("candidateAssessmentDatepicker");
        this.datepicker.hide();
        
        this.switch = $$("candidateAssessmentSwitch");
        this.switch.attachEvent("onChange", getCandidateAssessmentSwitchHandler(this));

        this.activateEmptyMode();
        console.log("assessment selector loaded.");
    }

    clear() {
        this.richselect.setValue("");
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
    }

    getWebixConfig() {
        let assessmentListConfig = { rows: [
            {
                view: "toolbar",
                elements: [
                    {id: "employeeAssessmentNew", view: "button", value: "Добавить"},
                    {id: "employeeAssessmentDelete", view: "button", value: "Убрать"},
                ]
            },
            {
                id: "employeeAssessmentList",
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
                    id: "employeeAssessmentSelect",
                    view: "richselect",
                    placeholder: "Выберите собеседование",
                    gravity: 1,
                    options: [],
                },
                {
                    id: "employeeAssessmentSwitch",
                    view: "switch",
                    value: 0,
                    label: "Создать",
                    labelPosition: "top",
                },
                {
                    id: "employeeAssessmentDatepicker",
                    view: "datepicker",
                    value: new Date(),
                    label: "Дата и время",
                    labelPosition: "top",
                    timepicker: true,
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

function getEmployeeAssessmentSwitchHandler(workspace) {
    let handler = function(newValue) {
        if (newValue === 1) {
            workspace.switch.define("label", "Выбрать");
            workspace.switch.refresh();
            workspace.datepicker.show();
        } else {
            workspace.switch.define("label", "Создать");
            workspace.switch.refresh();
            workspace.datepicker.hide();
        }
    }

    return handler;
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

function getCandidateAssessmentDeleteHandler(workspace) {
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

function getCandidateAssessmentNewHandler(workspace) {
    let handler = function() {
        workspace.activateNewMode();
        workspace.newId = workspace.list.add({dateTime:"Выберите дату..."});
        workspace.list.select(workspace.newId);
        workspace.selectedId = "0";
        workspace.richselect.setValue(0);
    }

    return handler;
}

function getRichselectChangeHandler(workspace) {
    let handler = function(newValue, oldValue) {
        if (newValue !== workspace.selectedId) {
            let item = workspace.list.getSelectedItem();
            let assessment = workspace.data.find(value => value.id === newValue);
            item.dateTime = assessment.dateTime;
            item.assessmentId = parseInt(assessment.id);
            item.candidateId = parseInt(workspace.currentCandidateId);
            item.isConfirmed = "null";
            workspace.list.refresh();
            if (workspace.mode === "new") {
                workspace.activateEditMode();
                workspace.newId = "";
            }
        }
    }

    return handler;
}