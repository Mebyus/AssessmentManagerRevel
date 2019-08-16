/**
 * Класс для управления контейнером SelectBox, в который можно добавлять (метод select) и
 * из которого можно удалять (метод unselect) элементы, первоначально содержащиеся в
 * массиве data. Добавить элемент в контейнер можно только в единственном
 * экземпляре, после чего он исчезнет из массива availableData и больше не будет 
 * доступен для добавления.
 */
class SelectBox {
    constructor(data) {
        this.selected = [];
        this.available = Array.from(data);
    }

    reset(data) {
        this.selected = [];
        this.available = Array.from(data);
    }

    /**
     * В случае если элемент item присутствует в контейнере availableData, добавляет его в
     * контейнер selectedData и удаляет из availableData.
     * @param {any} item Элемент, который будет добавлен в контейнер selectedData.
     * @returns {number} Возвращает получившуюся длину массива selectedData, если операция
     * прошла успешно и -1 в противном случае.
     */
    select(item) {
        let index = this.available.indexOf(item);
        if (index !== -1) {
            this.available.splice(index, 1);
            return this.selected.push(item);
        }

        return -1;
    }

    selectId(id) {
        let stringId = id.toString();
        let index = this.available.findIndex(element => element.id === stringId);
        if (index !== -1) {
            this.selected.push(this.available[index]);
            return this.available.splice(index, 1)[0];
        }

    }

    /**
     * В случае если элемент item присутствует в контейнере selectedData, добавляет его в
     * контейнер availableData и удаляет из selectedData.
     * @param {any} item Элемент, который будет удален из контейнера selectedData.
     * @returns {number} Возвращает получившуюся длину массива availableData, если операция
     * прошла успешно и -1 в противном случае.
     */
    unselect(item) {
        let index = this.selected.indexOf(item);
        if (index !== -1) {
            this.selected.splice(index, 1);
            return this.available.push(item);
        }

        return -1;
    }
}

export class SelectBoxComponent {
    constructor(data, parentForHeaderId, parentForBodyId, getDataElementUI) {
        this.data = data;
        this.box = new SelectBox(data);
        this.parentForHeaderId = parentForHeaderId;
        this.parentForBodyId = parentForBodyId;
        this.getDataElementUI = getDataElementUI;
    }

    init() {
        let headerUIConfig = {
            view: "richselect", 
            options: this.box.available,
        };

        this.parentForHeader = $$(this.parentForHeaderId);
        this.parentForBody = $$(this.parentForBodyId);
        this.body = this.parentForBody.getBody();


        let headerId = this.parentForHeader.addView(headerUIConfig, 1);
        this.header = $$(headerId);
        this.header.attachEvent("onChange", getSelectChangeHandler(this));
    }

    refresh() {
        this.header.define("options", this.box.available);
    }

    reset(data) {
        this.data = data;
        this.box.reset(data);
        let childs = this.body.getChildViews();
        for (let i = childs.length - 1; i >= 0; i--) {
            this.body.removeView(childs[i]);
        }
    }

    getInputData() {
        return this.box.selected;
    }

    selectFrom(data, itemId) {
        if (data) { 
            data.forEach(element => {
                let item = this.box.selectId(itemId(element));
                if (item) {
                    let newCard = this.getDataElementUI(this, item);
                    this.body.addView(newCard, 0);
                }
            });
            this.refresh();
        }
    }
}

function getSelectChangeHandler(boxComponent) {
    let handler = function(newValue, oldValue) {
        if (newValue) {
            boxComponent.header.setValue(0);

            let selectedId = newValue;
            let item = boxComponent.data.find(value => value.id === selectedId);
            let newCard = boxComponent.getDataElementUI(boxComponent, item);

            boxComponent.body.addView(newCard, 0);
            boxComponent.box.select(item);
            boxComponent.header.define("options", boxComponent.box.available);
        }
    }
    return handler;
}

function getUnselectClickHandler(boxComponent, item) {
    let handler = function (id, event) {
        let element = $$(id).getParentView();
        element.getParentView().removeView(element);
        boxComponent.box.unselect(item);
        boxComponent.header.define("options", boxComponent.box.available);
    }
    return handler;
}

export function getEmployeeCardConfig(boxComponent, employee) {
    let card = {
        view: "toolbar",
        elements: [
            {view: "label", label: employee.lastName + " " + employee.firstName},
            {
                view: "button", value: "-", width:50, 
                click: getUnselectClickHandler(boxComponent, employee),
            },
        ]
    }
    return card;
}


