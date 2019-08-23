export class UserPanelComponent {
    constructor(url) {
        this.url = url;
    }

    init() {

    }

    getWebixConfig() {
        let panelConfig = {
            view: "toolbar",
            elements: [
                {view: "label", label: "Управление собеседованиями", align: "center"},
                {
                    view: "button", 
                    value: "Logout", 
                    click: "location.href='" + this.url + "/logout'",
                    autowidth: true,
                },
            ],
        }

        return panelConfig;
    }
}