class AppWorkspace {
    constructor(url) {
        this.url = url;
        this.navigationBar = new NavigationBarComponent();
        this.candidatesWorkspace = new CandidatesWorkspaceComponent(url);
        this.assessmentsWorkspace = new AssessmentsWorkspaceComponent(url);
        this.employeesWorkspace = new EmployeesWorkspaceComponent(url);
    }

    init() {
        this.navigationBar.init();
        webix.Date.startOnMonday = true;
        webix.ui(this.getWebixUI());
        this.candidatesWorkspace.init();
        this.assessmentsWorkspace.init();
        this.employeesWorkspace.init();
        console.log("app workspace loaded.");
    }

    getWebixUI() {
        let candidatesWorkspaceUI = this.candidatesWorkspace.getWebixUI();
        let assessmentsWorkspaceUI = this.assessmentsWorkspace.getWebixUI();
        let employeesWorkspaceUI = this.employeesWorkspace.getWebixUI()
        
        let appUI = {
            id:"tabView",
            view:"tabview",
            cells:[     
                {
                    header: "Candidates",
                    body: candidatesWorkspaceUI,
                },
                { 
                    header:"Assessments", 
                    body: assessmentsWorkspaceUI,
                },
                {
                    header:"Employees",
                    body: employeesWorkspaceUI,
                },
            ],
        };

        return appUI;
    }
}

let url = "http://localhost:9000";

testApp = new AppWorkspace(url);
testApp.init();