import {EmployeePickerComponent} from "./picker.js";
import {EmployeeViewerComponent} from "./viewer.js";
import {EmployeeRequester} from "./../../models/employees/requester.js";

export class EmployeeWorkspaceComponent {
    constructor(url) {
        this.picker = new EmployeePickerComponent(this);
        this.viewer = new EmployeeViewerComponent(this);
        this.model = new EmployeeRequester(url);
        this.currentEmployeeId = null;
    }

    init() {
        this.picker.init();
        this.viewer.init();
        this.ui = $$("employeesWorkspace");
        this.ui.attachEvent("onViewShow", getEmployeesWorkspaceShowHandler(this));    
        this.changeViewerMode("view");
        this.updateList();
    }

    update() {
        this.updateList();
        this.viewEmployee(this.currentEmployeeId);
    }

    search(searchString) {
        this.model.search(searchString, (employees => this.picker.set.call(this.picker, employees)));
    }

    updateList() {
        let searchString = this.picker.listInput.getValue();
        if (searchString) {
            this.search(searchString);
        } else {
            this.model.getAll(employees => this.picker.set.call(this.picker, employees));
        }
    }

    viewEmployee(id) {
        this.currentEmployeeId = id;
        this.viewer.selector.currentEmployeeId = id;
        if (id) {
            this.model.get(id, employee => this.viewer.view.call(this.viewer, employee));
            this.model.getAllAssessmentPromise(assessments => this.viewer.selector.setOptions(assessments));
        }
    }

    clearViewer() {
        this.viewer.clear();
    }

    deleteCurrentEmployee() {
        if (this.currentEmployeeId) {
            this.model.delete(this.currentEmployeeId, () => {
                this.clearViewer();
                this.updateList();
                webix.message({
                    text: "Сотрудник удален",
                    type: "success",
                    expire: 2000,
                });
            });
        }
    }

    updateCurrentEmployee() {
        if (this.picker.table.exists(this.currentEmployeeId)) {
            let tableIndex = this.picker.table.getIndexById(this.currentEmployeeId);
            this.model.get(this.currentEmployeeId, employee => {
                this.picker.table.remove(this.currentEmployeeId);
                let newId = this.picker.table.add(employee, tableIndex);
                this.picker.table.select(newId);
                this.currentEmployeeId = newId;
            });
        }
    }

    createFromViewerData() {
        let input = this.viewer.getInputData();
        input.assessmentList = this.viewer.selector.getInputData();
        this.model.add(input, () => this.updateList());
    }

    updateFromViewerData() {
        let input = this.viewer.getInputData();
        input.assessmentList = this.viewer.selector.getInputData();
        this.model.update(this.currentEmployeeId, input, () => {
            // this.updateList();
            this.updateCurrentEmployee();
            webix.message({
                text: "Данные успешно обновлены",
                type: "success",
                expire: 2000,
            });
        });
    }

    changeViewerMode(mode) {
        this.viewer.mode = mode;
        switch (mode) {
            case "view":
                this.viewer.activateViewMode()
                break;

            case "create":
                this.clearViewer();
                this.viewer.activateCreateMode();

                this.model.getAllAssessmentPromise(assessments => this.viewer.selector.setOptions(assessments));
                break;

            default:
                throw "Employee Viewer doesn't have this mode: " + mode;
        }
    }

    getWebixConfig() {
        let pickerUI = this.picker.getWebixConfig();
        let viewerUI = this.viewer.getWebixConfig();

        let employeesWorkspace = {
            id:"employeesWorkspace",
            cols: [
                pickerUI,
                viewerUI,
            ]
        }

        return employeesWorkspace;
    }
}

function getEmployeesWorkspaceShowHandler(workspace) {
    let handler = function() {
        workspace.update();
    }

    return handler;
}