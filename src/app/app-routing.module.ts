import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentsComponent } from './components/agents/agents.component';
import { CampaignComponent } from './components/campaign/campaign.component';
import { DataTablesComponent } from './components/data-tables/data-tables.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { QuestionComponent } from './components/question/question.component';
import { LogicSettingComponent } from './components/logic-setting/logic-setting.component';
import { LeadsComponent } from './components/leads/leads.component';
import { ReportsComponent } from './components/reports/reports.component';
import { EditCampaignComponent } from './components/edit-campaign/edit-campaign.component';
import { CreateTableComponent } from './components/create-table/create-table.component';
import { CreateQuestionsComponent } from './components/create-questions/create-questions.component';
import { EditQuestionComponent } from './components/edit-question/edit-question.component';
import { EditAgentComponent } from './components/edit-agent/edit-agent.component';
import { GenerateLeadsComponent } from './components/generate-leads/generate-leads.component';
import { ReGenerateComponent } from './components/re-generate/re-generate.component';
import { DeleteLeadsComponent } from './components/delete-leads/delete-leads.component';
import { LogicManagementComponent } from './components/logic-management/logic-management.component';
import { SetLogicsComponent } from './components/set-logics/set-logics.component';
import { UpdateLogicComponent } from './components/update-logic/update-logic.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { ViewFullCRMComponent } from './components/agentPanel/view-full-crm/view-full-crm.component';
import { CRMComponent } from './components/agentPanel/crm/crm.component';
import { QcPanelComponent } from './components/qc-panel/qc-panel.component';
import { InBoundViewComponentComponent } from './components/agentPanel/in-bound-view-component/in-bound-view-component.component';
import { QcEditComponent } from './components/qc-edit/qc-edit.component';
import { QcRecordsViewComponent } from './components/qc-records-view/qc-records-view.component';
import { QcReportsComponent } from './components/qcPanel/qc-reports/qc-reports.component';
import { QcRecordsClientComponent } from './components/qcPanel/qc-records-client/qc-records-client.component';
import { EditClientRecordsComponent } from './qcPanel/edit-client-records/edit-client-records.component';


const routes: Routes = [
  {path: 'agents', component: AgentsComponent},
  {path: 'campaign', component: CampaignComponent},
  {path: 'dataTables', component: DataTablesComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'question', component: QuestionComponent},
  {path: 'logicSetting', component: LogicSettingComponent},
  {path: 'leads', component: LeadsComponent},
  
  {path: "editCampaign/:id", component: EditCampaignComponent},
  {path: "createTable", component: CreateTableComponent},
  {path: "createQuestions", component: CreateQuestionsComponent},
  {path: "editQuestion/:id", component: EditQuestionComponent},
  {path: "editAgent/:id", component: EditAgentComponent},
  {path: "generateLead", component: GenerateLeadsComponent},
  {path: "reGenerateLead", component: ReGenerateComponent},
  {path: "deleteLeads", component: DeleteLeadsComponent},
  {path: "logicManagement/:campaignName", component: LogicManagementComponent},
  {path: "setLogics", component: SetLogicsComponent},
  {path: "updateLogics", component: UpdateLogicComponent},
  {path: "login", component: LoginPageComponent},
  {path: "viewFullCRM", component: ViewFullCRMComponent},
  {path: "CRM", component: CRMComponent},
  {path: "qcChecking", component: QcPanelComponent},
  {path: "inboundView", component: InBoundViewComponentComponent},
  {path: "editqc/:id", component: QcEditComponent},
  {path: "editClientqc/:id", component: EditClientRecordsComponent},
  {path: "viewQcReports", component: QcRecordsViewComponent},
  {path: "QcReports", component: QcReportsComponent},
  {path: "QcRecordsClient", component: QcRecordsClientComponent},
  {path: 'reports', component: ReportsComponent},
  {path: '', component: LoginPageComponent},
  // {path:'**', component: LoginPageComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
