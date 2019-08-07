class CandidatePickerComponent {
    constructor(workspace) {
        this.workspace = workspace;
    }

    init() {
        this.table = $$("candidateTable");
        this.table.attachEvent("onSelectChange", getCandidateSelectChangeHandler(this.workspace));

        this.newButton = $$("newCandidateButton");
        this.newButton.attachEvent("onItemClick", getNewCandidateClickHandler(this.workspace));
        
        console.log("candidate picker loaded.");
    }

    /**
     * Очищает таблицу кандидатов и заполняет ее новыми данными из параметра candidates.
     * @param {Array} candidates Массив с новыми данными для таблцы.
     */
    set(candidates) {
        this.table.clearAll();
        this.table.parse(candidates);
        this.table.refresh();
    }

    getWebixUI() {
        let tableToolbar = {
            id: "candidateListToolbar",
            view: "toolbar",
            elements: [
                {id: "newCandidateButton", view:"button", value: "New"},
            ]
        }
        
        let table = {
            id: "candidateTable",
            view: "datatable",
            columns: [
                {id:"firstName", header:"Name", fillspace:true},
                {id:"phone", header:"Phone", fillspace:true},
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
        workspace.changeViewerMode("view");
        let item = workspace.picker.table.getSelectedItem();
        if (item) {
            workspace.viewCandidate(item.id);
        }
    }
    return handler;
}


function getNewCandidateClickHandler(workspace) {
    let handler = function () {
        workspace.changeViewerMode("create");
    }
    return handler;
}
