import {AssessmentPickerComponent} from "./picker.js";
import {AssessmentViewerComponent} from "./viewer.js";
import {AssessmentRequester} from "./../../models/assessments/requester.js"

export class AssessmentWorkspaceComponent {
    constructor(url) {
        this.picker = new AssessmentPickerComponent(this);
        this.viewer = new AssessmentViewerComponent(this);
        this.model = new AssessmentRequester(url);
        this.currentAssessmentId = "";
    }

    init() {
        this.picker.init();
        this.viewer.init();
        this.ui = $$("candidatesWorkspace");
        this.ui.attachEvent("onViewShow", getAssessmentWorkspaceShowHandler(this));
        this.changeViewerMode("view");
        this.updateList();
    }

    update() {
        this.updateList();
        this.viewAssessment(this.currentAssessmentId);
    }

    search(dateRange) {
        this.model.search(dateRange, (assessments => this.picker.set.call(this.picker, assessments)));
    }

    updateList() {
        let searchValue = this.picker.listInput.getValue();
        if (searchValue.start && searchValue.end) {
            let dateRange = {
                start: searchValue.start.toJSON(),
                end: searchValue.end.toJSON(),
            }
            this.search(dateRange);
        } else {
            this.model.getAll(assessments => this.picker.set.call(this.picker, assessments));
        }
    }

    viewAssessment(id) {
        this.currentAssessmentId = id;
        
        if (id) {
            let allCandidatePromise = this.model.getAllCandidatePromise(candidates => {
                candidates.forEach(element => {
                    element.comment = "";
                    element.isConfirmed = "null";
                    element.result = 0;
                });
                this.viewer.setCandidateOptions(candidates);
            });

            let allEmployeePromise = this.model.getAllEmployeePromise(employees => {
                this.viewer.setEmployeeOptions(employees);
            });

            this.model.get(id, assessment => {
                allCandidatePromise.then(canidateResult => {
                    allEmployeePromise.then(employeeResult => {
                        this.viewer.view.call(this.viewer, assessment);
                    });
                });
            });
        }
    }

    clearViewer() {
        this.viewer.clear();
    }

    deleteCurrentAssessment() {
        if (this.currentAssessmentId) {
            this.model.delete(this.currentAssessmentId, () => function() {
                this.clearViewer();
                this.updateList();
            }.call(this)); 
        }
    }

    updateCurrent() {
        if (this.picker.table.exists(this.currentAssessmentId)) {
            let allCandidatePromise = this.model.getAllCandidatePromise(candidates => {
                candidates.forEach(element => {
                    element.comment = "";
                    element.isConfirmed = "null";
                    element.result = 0;
                });
                this.viewer.setCandidateOptions(candidates);
            });

            let allEmployeePromise = this.model.getAllEmployeePromise(employees => {
                this.viewer.setEmployeeOptions(employees);
            });
            let tableIndex = this.picker.table.getIndexById(this.currentAssessmentId);
            this.model.get(this.currentAssessmentId, assessment => {
                this.picker.table.remove(this.currentAssessmentId);
                assessment.value = new Date(assessment.dateTime);
                let newId = this.picker.table.add(assessment, tableIndex);
                this.viewer.view(assessment);
                this.picker.table.select(newId);
                this.currentAssessmentId = newId;
                allCandidatePromise.then(canidateResult => {
                    allEmployeePromise.then(employeeResult => {
                        this.viewer.view.call(this.viewer, assessment);
                    });
                });
            });
        }
    }

    createFromViewerData() {
        let input = this.viewer.getInputData();
        this.model.add(input, () => this.updateList());
    }

    updateFromViewerData() {
        let input = this.viewer.getInputData();
        this.model.update(this.currentAssessmentId, input, () => {
            // this.updateList();
            this.updateCurrent();
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

                this.model.getAllCandidatePromise(candidates => {
                    candidates.forEach(element => {
                        element.comment = "";
                        element.isConfirmed = "null";
                        element.result = 0;
                    });
                    this.viewer.setCandidateOptions(candidates);
                });
        
                this.model.getAllEmployeePromise(employees => {
                    this.viewer.setEmployeeOptions(employees);
                });
                break;

            default:
                throw "Assessment Viewer doesn't have this mode: " + mode;
        }
    }

    getWebixConfig() {
        let pickerUI = this.picker.getWebixConfig();
        let viewerUI = this.viewer.getWebixConfig();

        let assessmentsWorkspaceUI = {
            id:"assessmentssWorkspace",
            cols: [
                pickerUI,
                viewerUI,
            ]
        }

        return assessmentsWorkspaceUI;
    }
}

function getAssessmentWorkspaceShowHandler(workspace) {
    let handler = function() {
        workspace.update();
    }

    return handler;
}