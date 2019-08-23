import {SelectBoxComponent, getEmployeeCardConfig, getCandidateCardConfig} from "./selectbox.js";

export class AssessmentViewerComponent {
    constructor(workspace) {
        this.workspace = workspace;
        this.employeeBox = new SelectBoxComponent(this, [], "EmployeeSelectBox", 
                "EmployeeBoxScroll", getEmployeeCardConfig);
        this.candidateBox = new SelectBoxComponent(this, [], "CandidateSelectBox", 
                "CandidateBoxScroll", getCandidateCardConfig, true, getCandidateCardClickHandler);
        this.currentAssessmentId = "";
        this.currentCandidateId = "";
    }

    init() {
        this.employeeBox.init();
        this.candidateBox.init();

        this.dateForm = $$("assessmentDateTimeForm");
        this.resultForm = $$("CandidateResultForm");
        this.resultForm.disable();

        this.confirmButton = $$("assessmentConfirmButton");
        this.confirmButton.attachEvent("onItemClick", getAssessmentConfirmClickHandler(this.workspace));
        
        this.deleteButton = $$("assessmentDeleteButton");
        this.deleteButton.attachEvent("onItemClick", getAssessmentDeleteClickHandler(this.workspace));
    }

    view(assessment) {
        this.currentAssessmentId = assessment.id;
        this.currentCandidateId = "";
        this.dateForm.setValues({
            dateTime: new Date(assessment.dateTime),
        });
        this.resultForm.setValues({
            isConfirmed: 0,
            result: 0,
            comment: "",
        });
        this.employeeBox.selectFrom(assessment.employeeList, element => element.employeeId, 
            (employee, element) => {});
        this.candidateBox.selectFrom(assessment.candidateList, element => element.candidateId, 
            (candidate, element) => {
                candidate.comment = element.comment;
                candidate.result = element.result;
                candidate.isConfirmed = element.isConfirmed;
            });
        this.resultForm.disable();
    }

    setEmployeeOptions(employees) {
        employees.forEach(element => {
            element.value = element.lastName + " " + element.firstName;
        });
        this.employeeBox.reset(employees);
        this.employeeBox.refresh();
    }

    setCandidateOptions(candidates) {
        candidates.forEach(element => {
            element.value = element.lastName + " " + element.firstName;
        });
        this.candidateBox.reset(candidates);
        this.candidateBox.refresh();
    }

    setCandidateResult(candidate) {
        let isConfirmed;
        switch (candidate.isConfirmed) {
            case "true":
                isConfirmed = "1";
                break;
            case "false":
                isConfirmed = "2";
                break;
            default:
                isConfirmed = "0";
        }
        this.resultForm.setValues({
            isConfirmed: isConfirmed,
            result: candidate.result,
            comment: candidate.comment,
        });
    }

    activateViewMode() {
        this.deleteButton.enable();
    }

    activateCreateMode() {
        this.deleteButton.disable();
    }

    clear() {
        this.dateForm.clear();
        this.dateForm.setValues({
            dateTime: new Date(),
        });
        this.resultForm.disable();
    }

    getInputData() {
        let input = this.dateForm.getValues();

        let resultInput = this.resultForm.getValues();
        if (this.candidateBox.selectedItem) {
            this.candidateBox.selectedItem.result = parseInt(resultInput.result);
            this.candidateBox.selectedItem.comment = resultInput.comment;
        }

        input.employeeList = this.employeeBox.getInputData();
        for (let element of input.employeeList) {
            element.employeeId = parseInt(element.id, 10);
            element.assessmentId = parseInt(this.currentAssessmentId, 10);
            delete element.id;
        }

        input.candidateList = this.candidateBox.getInputData();
        for (let element of input.candidateList) {
            element.candidateId = parseInt(element.id, 10);
            element.assessmentId = parseInt(this.currentAssessmentId, 10);
            delete element.id;
        }
        return input;
    }

    getWebixConfig() {
        let employeeSelectBoxConfig = {
            id: "EmployeeSelectBox",
            borderless:false,
            rows: [
                {view:"label", label: "Сотрудники", align: "center"},
                {
                    id:"EmployeeBoxScroll",
                    view:"scrollview",
                    scroll:"y",
                    body:{
                        id:"EmployeeBoxScrollBody",
                        rows:[],
                    },
                },
            ],
        };

        let candidateSelectBoxConfig = {
            id:"CandidateSelectBox",
            borderless:false,
            rows: [
                {view:"label", label: "Кандидаты", align: "center"},
                {
                    id: "CandidateBoxScroll",
                    view:"scrollview",
                    scroll:"y",
                    body:{
                        id: "EmployeeBoxScrollBody",
                        rows:[],
                    },
                },
            ],
        };

        let toolbarUI = {
            id: "assessmentsViewerToolbar",
            view: "toolbar",
            elements: [
                {view:"label", label:"Информация о собеседовании", align:"center"},
                {id: "assessmentConfirmButton", view:"button", type:"icon", icon:"wxi-check", autowidth:true},
                {id: "assessmentDeleteButton", view:"button", type:"icon", icon:"wxi-trash", autowidth:true},
            ],
        }

        let dateTimeFormUI = {
            id: "assessmentDateTimeForm",
            view: "form",
            cols:[
                {
                    name: "dateTime", 
                    gravity: 1,
                    view:"datepicker", 
                    timepicker:true, 
                    label: "Дата и время", 
                    labelPosition: "top",
                    format: "%d.%m.%y -- %H:%i",
                },
                {
                    gravity: 1,
                },
            ],
        }

        let candidateResultUI = {
            id: "CandidateResultForm",
            view:"form",
            cols: [
                {
                    name:"isConfirmed",
                    view:"radio",
                    label: "Явка",
                    labelPosition: "top",
                    gravity:1,
                    vertical: true,
                    value: 0,
                    options: [
                        {id: 0, value:"Неизвестно"},
                        {id: 1, value:"Явился"},
                        {id: 2, value:"Не явился"},
                    ],
                },
                {
                    name:"result",
                    view:"radio",
                    label: "Результат",
                    labelPosition: "top",
                    gravity:1,
                    vertical: true,
                    value: 0,
                    options: [
                        {id: 0, value:"Не завершено"},
                        {id: 1, value:"Принять"},
                        {id: 2, value:"Отказать"},
                    ],
                },
                {
                    name:"comment",
                    view:"textarea",
                    height:150,
                    gravity:3,
                },
            ],
        };

        let scrollableViewverPartUI = {
            rows:[
                    dateTimeFormUI,
                {
                    cols:[
                        candidateSelectBoxConfig,
                        employeeSelectBoxConfig,
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

function parseConfirm(value) {
    switch (value) {
        case "1":
            return "true";
        case "2":
            return "false";
        default:
            return "null";
    }
}

function getCandidateCardClickHandler(boxComponent, cardId, item) {
    let handler = function(event) {
        let resultInput = boxComponent.workspace.resultForm.getValues();
        if (boxComponent.selectedItem) {
            boxComponent.selectedItem.isConfirmed = parseConfirm(resultInput.isConfirmed);
            boxComponent.selectedItem.result = parseInt(resultInput.result);
            boxComponent.selectedItem.comment = resultInput.comment;
        }
        boxComponent.setSelection(cardId, item);
        boxComponent.workspace.resultForm.enable();
        boxComponent.workspace.setCandidateResult(item);
    }
    return handler;
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