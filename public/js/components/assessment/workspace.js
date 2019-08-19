import {AssessmentPickerComponent} from "./picker.js";
import {AssessmentViewerComponent} from "./viewer.js";
import {AssessmentRequester} from "./../../models/assessments/requester.js"

export class AssessmentWorkspaceComponent {
    constructor(url) {
        this.picker = new AssessmentPickerComponent(this);
        this.viewer = new AssessmentViewerComponent(this, url);
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

    updateList() {
        this.model.getAll(assessments => this.picker.set.call(this.picker, assessments));
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
        this.model.delete(this.currentAssessmentId, () => function() {
            this.clearViewer();
            this.updateList();
        }.call(this)); 
    }

    createFromViewerData() {
        let input = this.viewer.getInputData();
        console.log(input);
        this.model.add(input, () => this.updateList());
    }

    updateFromViewerData() {
        let input = this.viewer.getInputData();
        this.model.update(this.currentAssessmentId, input, () => this.updateList());
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