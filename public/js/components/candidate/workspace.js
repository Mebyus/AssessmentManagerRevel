import {CandidatePickerComponent} from "./picker.js";
import {CandidateViewerComponent} from "./viewer.js";
import {CandidateRequester} from "./../../models/candidates/requester.js";

/**
 * Класс для отображения и управления интерфейсом во вкладке кандидатов.
 */
export class CandidateWorkspaceComponent {
    constructor(url) {
        this.picker = new CandidatePickerComponent(this);
        this.viewer = new CandidateViewerComponent(this);
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

    /**
     * Обновляет список сотрудников и текущего выбранного кандидата.
     */
    update() {
        this.updateList();
        this.viewCandidate(this.currentCandidateId);
    }

    /**
     * Поиск кандидатов и отображение результата в таблице.
     * @param {string} searchString Строка для поиска.
     */
    search(searchString) {
        this.model.search(searchString, (candidates => this.picker.set.call(this.picker, candidates)));
    }

    /**
     * Обновляет содержимое списка кандидатов
     */
    updateList() {
        let searchString = this.picker.listInput.getValue();
        if (searchString) {
            this.search(searchString);
        } else {
            this.model.getAll(candidates => this.picker.set.call(this.picker, candidates));
        }
    }

    /**
     * Просмотр данных кандидата во viewer.
     * @param {string} id ID кандидата.
     */
    viewCandidate(id) {
        this.currentCandidateId = id;
        this.viewer.selector.currentCandidateId = id;
        if (id) {
            this.model.get(id, candidate => this.viewer.view.call(this.viewer, candidate));
            this.model.getAllAssessmentPromise(assessments => this.viewer.selector.setOptions(assessments));
        }
    }

    clearViewer() {
        this.viewer.clear();
    }

    /**
     * Удаляет текущего выбранного кандидата.
     */
    deleteCurrentCandidate() {
        if (this.currentCandidateId) {
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
    }

    /**
     * Обновляет отображение данных текущего кандидата.
     */
    updateCurrentCandidate() {
        if (this.picker.table.exists(this.currentCandidateId)) {
            let tableIndex = this.picker.table.getIndexById(this.currentCandidateId);
            this.model.get(this.currentCandidateId, candidate => {
                this.picker.table.remove(this.currentCandidateId);
                let newId = this.picker.table.add(candidate, tableIndex);
                this.picker.table.select(newId);
                this.currentCandidateId = newId;
                this.viewer.view(candidate);
            });
        }
    }

     /**
     * Создает кандидата по данным из формы.
     */
    createFromViewerData() {
        let input = this.viewer.getInputData();
        input.assessmentList = this.viewer.selector.getInputData();
        this.model.add(input, () => this.updateList());
    }

    /**
     * Сохраняет изменения данных кандидата из формы.
     */
    updateFromViewerData() {
        let input = this.viewer.getInputData();
        input.assessmentList = this.viewer.selector.getInputData();
        this.model.update(this.currentCandidateId, input, () => {
            // this.updateList();
            this.updateCurrentCandidate();
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