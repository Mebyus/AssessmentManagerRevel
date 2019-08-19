export class CandidatePickerComponent {
    constructor(workspace) {
        this.workspace = workspace;
        this.scrollState = {x: 0, y: 0};
        this.mode = "view";
        this.newId = "";
    }

    init() {
        this.table = $$("candidateTable");
        this.table.attachEvent("onSelectChange", getCandidateSelectChangeHandler(this.workspace));

        this.newButton = $$("newCandidateButton");
        this.newButton.attachEvent("onItemClick", getNewCandidateClickHandler(this.workspace));

        this.listInput = $$("candidateListInput");
        this.listInput.attachEvent("onTimedKeyPress", getCandidateListInputHandler(this));
    }

    activateNewMode() {
        this.mode = "new";
        this.newButton.disable();
    }

    activateViewMode() {
        this.mode = "view";
        this.newButton.enable();
    }

    /**
     * Очищает таблицу кандидатов и заполняет ее новыми данными из параметра candidates.
     * @param {Array} candidates Массив с новыми данными для таблцы.
     */
    set(candidates) {
        this.scrollState = this.table.getScrollState();
        this.table.clearAll();
        this.table.parse(candidates);
        this.table.sort("lastName");
        if (this.table.exists(this.workspace.currentCandidateId)) {
            this.table.select(this.workspace.currentCandidateId);
        }
        this.table.scrollTo(this.scrollState.x, this.scrollState.y);
        this.table.refresh();
    }

    getWebixConfig() {
        let tableToolbar = {
            id: "candidateListToolbar",
            view: "toolbar",
            elements: [
                {id: "newCandidateButton", view:"button", type:"icon", icon:"wxi-plus", autowidth:true},
                {id: "CandidateFindButton", view:"button", type:"iconButton", 
                    icon:"wxi-search", autowidth: true},
                {id: "candidateListInput", view:"text", css:"fltr", gravity: 2},
            ]
        }
        
        let table = {
            id: "candidateTable",
            view: "datatable",
            columns: [
                {id:"lastName", header:"Фамилия", fillspace:true},
                {id:"phone", header:"Телефон", fillspace:true},
                {id:"email", header:"Email", fillspace:true},
            ],
            select: true,
            data: [],
        }

        let candidatePicker = {
            id: "candidatePicker",
            gravity:1,
            rows: [
                tableToolbar,
                table,
            ]
        }

        return candidatePicker;
    }

}

/**
 * Создает обработчик события "onSelectChange" (смены выделения) в таблице
 * кандидатов.
 * @param {CandidateWorkspaceComponent} workspace Объект, содержащий 
 * CandidatePickerComponent с данной таблицей.
 * @returns {DocumentAndElementEventHandlers} Обработчик события "onSelectChange".
 */
function getCandidateSelectChangeHandler(workspace) {
    let handler = function () {
        let item = workspace.picker.table.getSelectedItem();
        if (item) {
            if (item.id !== workspace.picker.newId) {
                workspace.changeViewerMode("view");
                if (workspace.picker.table.exists(workspace.picker.newId)) {
                    workspace.picker.table.remove(workspace.picker.newId);
                }
                workspace.viewCandidate(item.id);
                workspace.picker.activateViewMode();    
            } 
        }
    }
    return handler;
}

function getCandidateListInputHandler(workspace) {
    let handler = function() {
        let value = workspace.listInput.getValue().toLowerCase();
        workspace.table.filter(function(item) {
            if (item.id !== workspace.newId) {
                return item.lastName.toLowerCase().indexOf(value) !== -1;            
            } else {
                return true;
            }
        });
    }
    return handler;
}

function getNewCandidateClickHandler(workspace) {
    let handler = function () {
        workspace.changeViewerMode("create");
        workspace.picker.activateNewMode();
        workspace.picker.newId = workspace.picker.table.add({}, 0);
        workspace.picker.table.select(workspace.picker.newId);
        workspace.picker.table.scrollTo(0, 0);
    }
    return handler;
}
