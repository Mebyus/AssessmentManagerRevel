// import CandidateViewerProvider from "./models/candidates/viewer.js";

class CandidatesWorkspaceComponent {
    constructor() {
        this.picker = new CandidatePickerComponent(this);
        this.viewer = new CandidateViewerComponent(this);
        this.model = new CandidateProvider();
        this.currentCandidateId = null;
    }

    init() {
        this.picker.init();
        this.viewer.init();
        this.changeViewerMode("view");
        this.updateList();
        console.log("candidates workspace loaded.");
    }

    updateList() {
        let candidates = this.model.getAll();
        this.picker.set(candidates);
    }

    viewCandidate(id) {
        this.currentCandidateId = id;
        let candidate = this.model.get(id);
        this.viewer.view(candidate);
    }

    clearViewer() {
        this.viewer.clear();
    }

    deleteCurrentCandidate() {
        this.model.delete(this.currentCandidateId);
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
        this.model.update(this.currentCandidateId, input);
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
                throw "Candidate Viewer doesn't have this mode: " + mode;
        }
    }

    getWebixUI() {
        let pickerUI = this.picker.getWebixUI();
        let viewerUI = this.viewer.getWebixUI();

        let candidatesWorkspace = {
            id:"candidatesWorkspace",
            cols: [
                pickerUI,
                viewerUI,
            ]
        }

        return candidatesWorkspace;
    }
}
