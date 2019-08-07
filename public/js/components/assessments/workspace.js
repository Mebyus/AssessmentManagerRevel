class AssessmentsWorkspaceComponent {
    constructor() {
        this.picker = new AssessmentPickerComponent(this);
        this.viewer = new AssessmentViewerComponent(this);
        this.model = new AssessmentProvider();
        this.currentAssessmentId = null;
    }

    init() {
        this.picker.init();
        this.viewer.init();
        this.changeViewerMode("view");
        this.updateList();
        
        console.log("assessments workspace loaded.");
    }

    updateList() {
        let assessments = this.model.getAll();
        this.picker.set(assessments);
    }

    viewAssessment(id) {
        this.currentAssessmentId = id;
        let assessment = this.model.get(id);
        this.viewer.view(assessment);
    }

    clearViewer() {
        this.viewer.clear();
    }

    deleteCurrentAssessment() {
        this.model.delete(this.currentAssessmentId);
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
        this.model.update(this.currentAssessmentId, input);
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
                throw "Assessment Viewer doesn't have this mode: " + mode;
        }
    }

    getWebixUI() {
        let pickerUI = this.picker.getWebixUI();
        let viewerUI = this.viewer.getWebixUI();

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