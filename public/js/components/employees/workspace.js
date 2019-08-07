class EmployeesWorkspaceComponent {
    constructor() {
        this.picker = new EmployeePickerComponent(this);
        this.viewer = new EmployeeViewerComponent(this);
        this.model = new EmployeeProvider();
        this.currentEmployeeId = null;
    }

    init() {
        this.picker.init();
        this.viewer.init();
        this.changeViewerMode("view");
        this.updateList();

        console.log("employees workspace loaded.");
    }

    updateList() {
        let employees = this.model.getAll();
        this.picker.set(employees);
    }

    viewEmployee(id) {
        this.currentEmployeeId = id;
        let employee = this.model.get(id);
        this.viewer.view(employee);
    }

    clearViewer() {
        this.viewer.clear();
    }

    deleteCurrentEmployee() {
        this.model.delete(this.currentEmployeeId);
        this.clearViewer();
        this.updateList();
    }

    createFromViewerData() {
        let input = this.viewer.getInputData();
        this.model.add(input);
        this.updateList();
    }

    updateFromViewerData() {
        let input = this.viewer.getInputData();
        this.model.update(this.currentEmployeeId, input);
        this.updateList();
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

            // case "edit":
            //     this.viewer.activateEditMode();
            //     break;

            default:
                throw "Employee Viewer doesn't have this mode: " + mode;
        }
    }

    getWebixUI() {
        let pickerUI = this.picker.getWebixUI();
        let viewerUI = this.viewer.getWebixUI();

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