import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgentsComponent } from './components/agents/agents.component';
import { CampaignComponent } from './components/campaign/campaign.component';
import { DataTablesComponent } from './components/data-tables/data-tables.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { QuestionComponent } from './components/question/question.component';
import { LogicSettingComponent } from './components/logic-setting/logic-setting.component';
import { LeadsComponent } from './components/leads/leads.component';
import { ReportsComponent } from './components/reports/reports.component';
import { TopNavbarComponent } from './materials/top-navbar/top-navbar.component';
import { HttpClientModule } from  '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { AdminQcViewComponent } from './components/admin-qc-view/admin-qc-view.component';
import { QcReportsComponent } from './components/qcPanel/qc-reports/qc-reports.component';
import { QcRecordsClientComponent } from './components/qcPanel/qc-records-client/qc-records-client.component';
import { EditClientRecordsComponent } from './qcPanel/edit-client-records/edit-client-records.component';
import { PerformanceReportComponent } from './components/agentPanel/performance-report/performance-report.component';
import { ConcernRaisedComponent } from './qcPanel/concern-raised/concern-raised.component';



@NgModule({
  declarations: [
    AppComponent,
    AgentsComponent,
    CampaignComponent,
    DataTablesComponent,
    DashboardComponent,
    QuestionComponent,
    LogicSettingComponent,
    LeadsComponent,
    ReportsComponent,
    TopNavbarComponent,
    EditCampaignComponent,
    CreateTableComponent,
    CreateQuestionsComponent,
    EditQuestionComponent,
    EditAgentComponent,
    GenerateLeadsComponent,
    ReGenerateComponent,
    DeleteLeadsComponent,
    LogicManagementComponent,
    SetLogicsComponent,
    UpdateLogicComponent,
    LoginPageComponent,
    ViewFullCRMComponent,
    CRMComponent,
    QcPanelComponent,
    InBoundViewComponentComponent,
    QcEditComponent,
    QcRecordsViewComponent,
    AdminQcViewComponent,
    QcReportsComponent,
    QcRecordsClientComponent,
    EditClientRecordsComponent,
    PerformanceReportComponent,
    ConcernRaisedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
