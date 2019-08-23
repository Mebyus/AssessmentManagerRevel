import {CandidateWorkspaceComponent} from "./components/candidate/workspace.js";
import {AssessmentWorkspaceComponent} from "./components/assessment/workspace.js";
import {EmployeeWorkspaceComponent} from "./components/employee/workspace.js";
import {UserPanelComponent} from "./components/userpanel/panel.js";

class AppWorkspace {
    constructor(url = "") {
        this.url = url;
        this.candidateWorkspace = new CandidateWorkspaceComponent(url);
        this.assessmentWorkspace = new AssessmentWorkspaceComponent(url);
        this.employeeWorkspace = new EmployeeWorkspaceComponent(url);
        this.userPanel = new UserPanelComponent(url);
    }

    init() {
        webix.Date.startOnMonday = true;
        webix.i18n.setLocale("ru-RU");
        webix.ui(this.getWebixConfig());
        this.candidateWorkspace.init();
        this.assessmentWorkspace.init();
        this.employeeWorkspace.init();
        this.userPanel.init();
    }

    getWebixConfig() {
        let candidateWorkspaceConfig = this.candidateWorkspace.getWebixConfig();
        let assessmentWorkspaceConfig = this.assessmentWorkspace.getWebixConfig();
        let employeeWorkspaceConfig = this.employeeWorkspace.getWebixConfig()
        let userPanelConfig = this.userPanel.getWebixConfig();
        
        let tabViewConfig = {
            id:"AppTabView",
            view:"tabview",
            cells:[     
                {
                    header: "Кандидаты",
                    body: candidateWorkspaceConfig,
                },
                { 
                    header:"Собеседования", 
                    body: assessmentWorkspaceConfig,
                },
                {
                    header:"Сотрудники",
                    body: employeeWorkspaceConfig,
                },
            ],
        };
        
        let appConfig = {
            rows: [
                userPanelConfig,
                tabViewConfig,
            ],
        }

        return appConfig;
    }
}

let testApp = new AppWorkspace();
testApp.init();