/**
 * Класс для отображения и управления интерфейсом выбора собеседований
 * во вкладке кандидатов.
 */
export class AssessmentSelectorComponent {
    constructor(workspace) {
        this.workspace = workspace;
        this.currentCandidateId = "";
        this.selectedId = "";
        this.newId = "";
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
        this.newButton.attachEvent("onItemClick", getNewHandler(this));

        this.activateEmptyMode();
    }

    /**
     * Очищает интерфейс выбора собеседований.
     */
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

    /**
     * Устанавливает список собеседований кандидата из аргумента data
     * @param {Array} data Массив с данными собеседований.
     */
    setList(data) {
        this.list.clearAll();
        if (data) {
            data.forEach(element => {
                element.value = new Date(element.dateTime).toLocaleString("ru-Ru");
            });
        }
        this.list.parse(data);
        this.list.refresh();
    }

    /**
     * Возвращает данные собеседований из формы.
     */
    getInputData() {
        if (this.mode === "new") {
            this.list.remove(this.newId);
        }
        return this.list.serialize();
    }

    /**
     * Задает возможные варианты выбора новых собеседований.
     * @param {Array} data 
     */
    setOptions(data) {
        this.data = data;
        if (data) {
            data.forEach(element => {
                element.value = new Date(element.dateTime).toLocaleString("ru-Ru");
            });
        }
        this.richselect.define("options", data);
        this.richselect.setValue("");
    }

    getWebixConfig() {
        let assessmentListConfig = { rows: [
            {
                view: "toolbar",
                elements: [
                    {id: "candidateAssessmentNew", view: "button", value: "Добавить"},
                    {id: "candidateAssessmentDelete", view: "button", value: "Убрать"},
                ]
            },
            {
                id: "candidateAssessmentList",
                view: "list",
                gravity: 1,
                template: "#value#",
                select: true,
                data: [],
            },
        ]
        };

        let assessmentEditorConfig = { rows: [
                {
                    id: "candidateAssessmentSelect",
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
                assessmentEditorConfig,
                assessmentListConfig,
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

function getNewHandler(workspace) {
    let handler = function() {
        workspace.activateNewMode();
        workspace.newId = workspace.list.add({value:"Выберите дату..."});
        workspace.list.select(workspace.newId);
        workspace.selectedId = "";
        workspace.richselect.setValue("");
    }

    return handler;
}

function getRichselectChangeHandler(workspace) {
    let handler = function(newValue, oldValue) {
        if (newValue !== workspace.selectedId) {
            let item = workspace.list.getSelectedItem();
            let assessment = workspace.data.find(value => value.id === newValue);
            if (item && assessment) {
                item.dateTime = assessment.dateTime;
                item.value = assessment.value;
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
    }

    return handler;
}