import {CandidatePickerComponent} from "./picker.js";
import {CandidateViewerComponent} from "./viewer.js";
import {CandidateRequester} from "./../../models/candidates/requester.js";

export class CandidateWorkspaceComponent {
    constructor(url) {
        this.picker = new CandidatePickerComponent(this);
        this.viewer = new CandidateViewerComponent(this, url);
        this.model = new CandidateRequester(url);
        this.currentCandidateId = "";
    }

    init() {
        this.picker.init();
        this.viewer.init();
        this.ui = $$("candidatesWorkspace");
        this.ui.attachEvent("onViewShow", getCandidateWorkspaceShowHandler(this));
        this.changeViewerMode("view");
        this.updateList();
    }

    update() {
        this.updateList();
        this.viewCandidate(this.currentCandidateId);
    }

    updateList() {
        this.model.getAll(candidates => this.picker.set.call(this.picker, candidates));
    }

    viewCandidate(id) {
        this.currentCandidateId = id;
        this.viewer.selector.currentCandidateId = id;
        if (id) {
            this.model.get(id, candidate => this.viewer.view.call(this.viewer, candidate));
            this.viewer.model.getAll(assessments => this.viewer.selector.setOptions(assessments));
        }
    }

    clearViewer() {
        this.viewer.clear();
    }

    deleteCurrentCandidate() {
        this.model.delete(this.currentCandidateId, () => {
            this.clearViewer();
            this.updateList();
            webix.message({
                text: "Кандидат удален",
                type: "success",
                expire: 2000,
            });
        });        
    }

    createFromViewerData() {
        let input = this.viewer.getInputData();
        input.assessmentList = this.viewer.selector.getInputData();
        this.model.add(input, () => this.updateList());
    }

    updateFromViewerData() {
        let input = this.viewer.getInputData();
        input.assessmentList = this.viewer.selector.getInputData();
        this.model.update(this.currentCandidateId, input, () => {
            this.updateList();
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
                break;

            default:
                throw "Candidate Viewer doesn't have this mode: " + mode;
        }
    }

    getWebixConfig() {
        let pickerUI = this.picker.getWebixConfig();
        let viewerUI = this.viewer.getWebixConfig();

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

function getCandidateWorkspaceShowHandler(workspace) {
    let handler = function() {
        workspace.update();
    }

    return handler;
}