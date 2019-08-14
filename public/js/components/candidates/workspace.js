class CandidatesWorkspaceComponent {
    constructor(url) {
        this.picker = new CandidatePickerComponent(this);
        this.viewer = new CandidateViewerComponent(this, url);
        this.model = new CandidateRequester(url);
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
        this.model.getAll(candidates => this.picker.set.call(this.picker, candidates));
    }

    viewCandidate(id) {
        this.currentCandidateId = id;
        this.model.get(id, candidate => this.viewer.view.call(this.viewer, candidate));
        this.viewer.model.getAll(assessments => this.viewer.selector.setOptions(assessments));
    }

    clearViewer() {
        this.viewer.clear();
    }

    deleteCurrentCandidate() {
        this.model.delete(this.currentCandidateId, () => function() {
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
        this.model.update(this.currentCandidateId, input, () => this.updateList());
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
