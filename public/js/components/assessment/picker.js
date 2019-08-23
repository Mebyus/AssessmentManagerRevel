export class AssessmentPickerComponent {
    constructor(workspace) {
        this.workspace = workspace;
        this.mode = "view";
        this.newId = "";
    }

    init() {
        this.table = $$("assessmentTable");
        this.table.attachEvent("onSelectChange", getAssessmentSelectChangeHandler(this.workspace));

        this.newButton = $$("newAssessmentButton");
        this.newButton.attachEvent("onItemClick", getNewAssessmentClickHandler(this.workspace));

        this.syncButton = $$("AssessmentSyncButton");
        this.syncButton.attachEvent("onItemClick", getSyncButtonClickHandler(this.workspace));

        this.listInput = $$("AssessmentListInput");
        this.listInput.attachEvent("onChange", getSearchChangeHandler(this.workspace));
    }

    set(assessments) {
        this.scrollState = this.table.getScrollState();
        this.table.clearAll();
        if (assessments) {
            assessments.forEach(element => {
                element.value = new Date(element.dateTime);
            });
        }
        this.table.parse(assessments);
        this.table.sort("value", "asc", "date");
        if (this.table.exists(this.workspace.currentAssessmentId)) {
            this.table.select(this.workspace.currentAssessmentId);
        }
        this.table.scrollTo(this.scrollState.x, this.scrollState.y);
        this.table.refresh();
    }

    activateNewMode() {
        this.mode = "new";
        this.newButton.disable();
    }

    activateViewMode() {
        this.mode = "view";
        this.newButton.enable();
    }

    getWebixConfig() {
        let tableToolbar = {
            id: "assessmentTableToolbar",
            view: "toolbar",
            elements: [
                {id: "newAssessmentButton", view:"button", type:"icon", icon:"wxi-plus", autowidth:true},
                {id: "AssessmentSyncButton", view:"button", type:"icon", 
                    icon:"wxi-sync", autowidth: true},
                {id: "AssessmentListInput", view:"daterangepicker", placeholder:"Найти..."},
            ]
        }
        
        let table = {
            id: "assessmentTable",
            view: "datatable",
            columns: [
                {id: "value", header:"Дата", sort:"date", fillspace:true, 
                    format:function(date){
                        if (date) {
                            return date.toLocaleString('ru-RU');
                        }
                        return "";
                    }
                },
                // {id: "sortTime", header:"ms", fillspace:true,},
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

// function getListInputHandler(workspace) {
//     let handler = function() {
//         let value = workspace.listInput.getValue().toLowerCase();
//         workspace.table.filter(function(item) {
//             if (item.id !== workspace.newId) {
//                 return item.dateTime.toLowerCase().indexOf(value) !== -1;            
//             } else {
//                 return true;
//             }
//         });
//     }
//     return handler;
// }

function getSearchChangeHandler(workspace) {
    let handler = function(newValue, oldValue) {
        if (newValue.start && newValue.end) {
            let dateRange = {
                start: newValue.start.toJSON(),
                end: newValue.end.toJSON(),
            };
            workspace.search(dateRange);
        } else {
            workspace.updateList();
        }
    }
    return handler;
}

function getSyncButtonClickHandler(workspace) {
    let handler = function() {
        workspace.update();
    }
    return handler;
}

function getAssessmentSelectChangeHandler(workspace) {
    let handler = function () {
        let item = workspace.picker.table.getSelectedItem();
        if (item) {
            if (item.id !== workspace.picker.newId) {
                workspace.changeViewerMode("view");
                if (workspace.picker.table.exists(workspace.picker.newId)) {
                    workspace.picker.table.remove(workspace.picker.newId);
                    workspace.picker.newId = "";
                }
                if (workspace.currentAssessmentId !== item.id) {
                    workspace.viewAssessment(item.id);
                }
                workspace.picker.activateViewMode();    
            } 
        }
    }
    return handler;
}

function getNewAssessmentClickHandler(workspace) {
    let handler = function () {
        workspace.changeViewerMode("create");
        workspace.picker.activateNewMode();
        workspace.picker.newId = workspace.picker.table.add({}, 0);
        workspace.picker.table.select(workspace.picker.newId);
        workspace.picker.table.scrollTo(0, 0);
    }
    return handler;
}
