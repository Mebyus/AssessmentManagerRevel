import {CandidateWorkspaceComponent} from "./components/candidate/workspace.js";
import {AssessmentWorkspaceComponent} from "./components/assessment/workspace.js";
import {EmployeeWorkspaceComponent} from "./components/employee/workspace.js";

class AppWorkspace {
    constructor(url = "") {
        this.url = url;
        this.candidateWorkspace = new CandidateWorkspaceComponent(url);
        this.assessmentWorkspace = new AssessmentWorkspaceComponent(url);
        this.employeeWorkspace = new EmployeeWorkspaceComponent(url);
    }

    init() {
        webix.Date.startOnMonday = true;
        webix.i18n.setLocale("ru-RU");
        webix.ui(this.getWebixConfig());
        this.candidateWorkspace.init();
        this.assessmentWorkspace.init();
        this.employeeWorkspace.init();
    }

    getWebixConfig() {
        let candidateWorkspaceConfig = this.candidateWorkspace.getWebixConfig();
        let assessmentWorkspaceConfig = this.assessmentWorkspace.getWebixConfig();
        let employeeWorkspaceConfig = this.employeeWorkspace.getWebixConfig()
        
        let appConfig = {
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

        return appConfig;
    }
}

let testApp = new AppWorkspace();
testApp.init();