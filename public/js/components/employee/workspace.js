import {EmployeeAssessmentSelectorComponent as Emp} from "./assessmentselector.js";
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

        console.log("employees workspace loaded.");
    }

    update() {
        this.updateList();
        this.viewEmployee(this.currentEmployeeId);
    }

    updateList() {
        this.model.getAll(employees => this.picker.set.call(this.picker, employees));
    }

    viewEmployee(id) {
        this.currentEmployeeId = id;
        if (id) {
            this.model.get(id, employee => this.viewer.view.call(this.viewer, employee));
        }
    }

    clearViewer() {
        this.viewer.clear();
    }

    deleteCurrentEmployee() {
        this.model.delete(this.currentEmployeeId, () => function() {
            this.clearViewer();
            this.updateList();
        }.call(this));   
    }

    createFromViewerData() {
        let input = this.viewer.getInputData();
        this.model.add(input, () => this.updateList());
    }

    updateFromViewerData() {
        let input = this.viewer.getInputData();
        this.model.update(this.currentEmployeeId, input, () => this.updateList());
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