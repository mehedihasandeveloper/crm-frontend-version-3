import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Campaign } from '../../model/Campaign';
import { DataTables } from '../../model/DataTables';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Question } from '../../model/Question';
import { Agent } from '../../model/Agent';

const AUTH_API = 'http://localhost:8080/api/auth/';

interface MP3FileInfo {
  dateTime: string;
  phoneNumber: string;
  campaignName: string;
  agentId: string;
  fileName: string;
  duration: number;
}

interface MP3FilePage {
  content: MP3FileInfo[];
  totalElements: number;
  totalPages: number;
  size: number;
  first: boolean;
  last: boolean;
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private baseURL = "http://localhost:8080";

  private questionTableURL = "http://localhost:8080/questions";

  private url = "http://localhost:8080/cc";

  private dataTableURL = "http://localhost:8080/dt";

  private dynamicTableURL = "http://localhost:8080/dynamic";

  private agentURL = "http://localhost:8080/api/ac";

  private generateUrl = 'http://localhost:8080/dynamic/updateData';

  private reGenerateUrl = 'http://localhost:8080/dynamic/reGenerateData';

  private deleteLeadsUrl = 'http://localhost:8080/dynamic/deleteLead';

  private getRowdynamicUrl = 'http://localhost:8080/dynamic/countNumberOfDataAvailable';

  private addLogicsURL = 'http://localhost:8080/api/logic';

  private agentPanelURL = 'http://localhost:8080/api/ap';

  private dynamicUrl = 'http://localhost:8080/dynamic';

  private mp3Url = 'https://voicelog.fifo-tech.com/search';

  getQuestionListWithPagination(offset: number, pageSize: number): Observable<any> {
    return this.httpClient.get(`${this.questionTableURL}/pagination/${offset}/${pageSize}`);
  }

  searchQuestion(term: string): Observable<any> {
    let params = new HttpParams();

    if (term && isNaN(parseInt(term, 10))) {
      params = params.set('campaignId', term)
        .set('title', term)
        .set('type', term)
        .set('options', term)
        .set('optionalValue', term)
        .set('instruction', term);
    }

    if (term.toLowerCase() === 'active') {
      params = params.set('status', 'true');
    } else if (term.toLowerCase() === 'inactive') {
      params = params.set('status', 'false');
    }

    return this.httpClient.get(this.questionTableURL + '/searchQuestion', { params });
  }

  getDataTablesListWithPagination(offset: number, pageSize: number): Observable<any> {
    return this.httpClient.get(`${this.dataTableURL}/pagination/${offset}/${pageSize}`);
  }

  searchDataTables(term: string): Observable<any> {
    let params = new HttpParams();

    if (term && isNaN(parseInt(term, 10))) {
      params = params.set('name', term)
        .set('campaignName', term);
    }

    const numberOfField = parseInt(term, 10);
    if (!isNaN(numberOfField) && !term.includes(".")) {
      params = params.set('numberOfField', numberOfField.toString());
    }
    return this.httpClient.get(this.dataTableURL + '/searchDataTables', { params });
  }

  getCampaignListWithPagination(offset: number, pageSize: number): Observable<any> {
    return this.httpClient.get(`${this.url}/pagination/${offset}/${pageSize}`);
  }

  searchCampaigns(term: string): Observable<any> {
    let params = new HttpParams();

    if (term && isNaN(parseInt(term, 10))) {
      params = params.set('campaignId', term)
        .set('campaignName', term);
    }

    const callTarget = parseInt(term, 10);
    if (!isNaN(callTarget) && !term.includes(".")) {
      params = params.set('callTarget', callTarget.toString());
    }

    if (term.toLowerCase() === 'active') {
      params = params.set('status', 'true');
    } else if (term.toLowerCase() === 'inactive') {
      params = params.set('status', 'false');
    }

    return this.httpClient.get(this.url + '/searchCampaign', { params });
  }

  getAgentListWithPagination(offset: number, pageSize: number): Observable<any> {
    return this.httpClient.get(`${this.agentURL}/pagination/${offset}/${pageSize}`);
  }

  searchAgents(term: string): Observable<any> {
    const params = new HttpParams()
      .set('name', term)
      .set('agentId', term)
      .set('type', term);

    return this.httpClient.get(this.agentURL + '/search', { params });
  }
  constructor(private httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
    }),
  };

  // adding a campaign
  addData(campaign: Campaign) {
    return this.httpClient.post(this.url + "/addCampaign", campaign);
  }
  // calling all campaigns
  getAll() {
    return this.httpClient.get(this.url + "/campaigns");
  }
  // deleting a campaign
  deleteById(id: any) {
    return this.httpClient.delete(this.url + "/delete/" + id);
  }
  // updating a campaign
  updateData(campaign: Campaign) {
    return this.httpClient.put(this.url + "/updateCampaign", campaign);
  }
  // calling a campaign by id
  getByID(id: any) {
    return this.httpClient.get(this.url + "/campaign/" + id);
  }


  //**************************************DATA TABLES**************************************************//

  // adding a data tables
  addDataTable(dataTables: DataTables) {
    return this.httpClient.post(this.dataTableURL + "/addDataTables", dataTables);
  }

  // calling all data tables
  getAllDataTables() {
    return this.httpClient.get(this.dataTableURL + "/viewAllDataTables");
  }

  // deleting a data tables
  deleteDataTableById(id: any) {
    return this.httpClient.delete(this.dataTableURL + "/deleteDataTables/" + id);
  }

  //************************************Dynamic Tables************************************************//
  addDynamicTable(data: any): Observable<any> {
    const params = {
      tableName: data.tableName,
      columns: data.columns
    };
    return this.httpClient.post(`${this.dynamicTableURL}/create`, null, { params });
  }

  deleteCampaignTable(campaignName: any): Observable<any>{
    const params = {
      campaignName: campaignName
    };
    return this.httpClient.delete(this.dynamicUrl + '/deleteCampaignTable', { params });
  }

  //************************************Questions************************************************//

  // Adding Questions
  addQuestions(questions: Question[]): Observable<Question[]> {
    return this.httpClient.post<Question[]>(`${this.questionTableURL}/add`, questions);
  }

  getAllQuestions() {
    return this.httpClient.get(this.questionTableURL + "/getAll");
  }

  deleteQuestion(id: any) {
    return this.httpClient.delete(this.questionTableURL + "/deleteQuestion/" + id);
  }

  // updating a question
  updateQuestion(question: Question) {
    return this.httpClient.put(this.questionTableURL + "/updateQuestion", question);
  }

  // calling a question by id
  getQuestionByID(id: any) {
    return this.httpClient.get(this.questionTableURL + "/getQuestion/" + id);
  }

  getToSetLogicQuestions(campaignId: string) {
    return this.httpClient.get(this.questionTableURL + "/getToSetLogic/" + campaignId);
  }

  //************************************Agent************************************************//

  addAgent(agent: Agent) {
    return this.httpClient.post(this.agentURL + "/addAgent", agent);
  }

  getAgentList() {
    return this.httpClient.get(this.agentURL + "/getAgentList");
  }

  deleteAgent(id: any) {
    return this.httpClient.delete(this.agentURL + "/deleteAgent/" + id);
  }

  updateAgent(agent: Agent) {
    return this.httpClient.put(this.agentURL + "/editAgent", agent);
  }

  getAgentById(id: any) {
    return this.httpClient.get(this.agentURL + "/getAgent/" + id);
  }

  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const req = new HttpRequest('POST', this.agentURL + "/upload", formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.httpClient.request(req).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError(error);
  }

  getUniqueJoiningDates(tableName: string): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.dynamicTableURL}/unique_data_dates/${tableName}`);
  }

  getUniqueTargetSelector(tableName: string): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.dynamicTableURL}/unique_target_selector/${tableName}`);
  }


  generateLeads(tableName: string, dataDate: string, callTargets: { [key: string]: number }): Observable<string> {
    const params = new HttpParams()
      .set('tableName', tableName)
      .set('dataDate', dataDate);

    return this.httpClient.post(this.generateUrl, callTargets, { params, responseType: 'text' });
  }


  reGenerateLeads(tableName: string, dataDate: string, targetSelectors: { [key: string]: number }): Observable<any> {
    const params = new HttpParams()
      .set('tableName', tableName)
      .set('dataDate', dataDate);

    return this.httpClient.post(this.reGenerateUrl, targetSelectors, { params, responseType: 'text' });
  }

 
  deleteLeads(tableName: string, dataDate: string): Observable<any> {
    const params = {
      tableName: tableName,
      dataDate: dataDate
    };
    return this.httpClient.delete(this.deleteLeadsUrl, { params });
  }

  logicData(data: any[]): Observable<any> {
    return this.httpClient.post<any>(`${this.addLogicsURL}/setLogics`, data);
  }

  isLogicExists(id: string): Observable<any> {
    const options = {
      params: new HttpParams().set('id', id)
    };
    return this.httpClient.get<any>(`${this.addLogicsURL}/isLogicExist`, options);
  }

  deleteLogic(id: string): Observable<any> {
    const options = {
      params: new HttpParams().set('id', id)
    };
    return this.httpClient.delete<any>(`${this.addLogicsURL}/clearLogic`, options);
  }
  updateLogic(data: any[]): Observable<any> {
    return this.httpClient.put<any>(`${this.addLogicsURL}/updateLogic`, data);
  }

  getAllCampaignLogic(campaignName: string) {
    const options = {
      params: new HttpParams().set('campaignName', campaignName)
    };
    return this.httpClient.get<any>(`${this.addLogicsURL}/getAllCampaignLogic`, options);
  }

  getLogicByQuestionId(questionId: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.addLogicsURL}?questionId=${questionId}`);
  }

  getLeadByCellNumber(tableName: string, cellNumber: string) {
    const params = {
      tableName: tableName,
      cellNumber: cellNumber
    };

    return this.httpClient.get(`${this.agentPanelURL}/getByNumber`, { params });
  }

  updateLeadByCellNumber(campaignName: string, cellNumber: string, updatedData: any) {
    const url = `${this.dynamicUrl}/updateLeadData/${campaignName}/${cellNumber}`;
    return this.httpClient.put<any>(url, updatedData);
  }


  getNumberOfData(campaignDataTable: string): Observable<number> {
    let params = new HttpParams().set('campaignDataTable', campaignDataTable);
    return this.httpClient.get<number>(this.getRowdynamicUrl, { params });
  }

  login(username: string, password: string): Observable<any> {
    return this.httpClient.post(AUTH_API + 'signInSuperAdmin',
      {
        username,
        password,
      },
      httpOptions
    );
  }

  loginAsAgent(username: string, password: string): Observable<any> {
    return this.httpClient.post(AUTH_API + 'signInAgent',
      {
        username,
        password,
      },
      httpOptions
    );
  }

  getTotalAgents(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseURL}/api/ac/totalAgents`);
  }

  getTotalCampaigns(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseURL}/cc/totalCampaigns`);
  }

  getTotalDataTables(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseURL}/dt/totalDataTables`);
  }

  getTotalInbound(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseURL}/cc/totalInbound`);
  }

  getTotalOutbound(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseURL}/cc/totalOutbound`);
  }

  getCampaignData(): Observable<{ campaignTitle: string, totalLeads: number, generatedLeads: number, calledLeads: number }[]> {
    return this.httpClient.get<{ campaignTitle: string, totalLeads: number, generatedLeads: number, calledLeads: number }[]>(`${this.baseURL}/dynamic/dashboard`);
  }

  
  searchMP3Files(directory: string, msisdn: string, page: number, size: number): Observable<MP3FilePage> {
    let params = new HttpParams().set('directory', directory)
      .set('msisdn', msisdn)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.httpClient.get<MP3FilePage>(this.mp3Url, { params });
  }

  addQcReport(reportData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.httpClient.post<any>(this.baseURL + "/api/qcReport/add", reportData, { headers });
  }

  addQcReportForClient(reportData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.httpClient.post<any>(this.baseURL + "/api/qcReport/addforclient", reportData, { headers });
  }

  // getQcReportsByInspector(username: string, offset: number, pageSize: number): Observable<APIResponse<QcReport>> {
  //   const params = new HttpParams().set('username', username);
  //   return this.httpClient.get<APIResponse<QcReport>>(`${this.baseUrl}/getqcreportbyqcinspector/${offset}/${pageSize}`, { params });
  // }

  deleteQc(id: any) {
    return this.httpClient.delete(this.baseURL + "/api/qcReport/deleteQc/" + id);
  }

  getQcReportsByInspector(username: string, offset: number, pageSize: number): Observable<any> {
    const params = new HttpParams().set('username', username);
    return this.httpClient.get(`${this.baseURL}/api/qcReport/getqcreportbyqcinspector/${offset}/${pageSize}`, { params });
  }

  // // Fetch all QC reports with pagination
  // getAllQcReports(offset: number, pageSize: number): Observable<APIResponse<QcReport>> {
  //   return this.httpClient.get<APIResponse<QcReport>>(`${this.baseUrl}/getallqcreports/${offset}/${pageSize}`);
  // }
  
  
  private apiUrl = '/vicidial/non_agent_api.php?source=test&user=fifotechapi&pass=F1f0t3ch&function=user_group_status&user_groups=Virtual|InHouse&header=YES';


  getQcReportById(id: any) {
    return this.httpClient.get(this.baseURL + "/api/qcReport/getqc/" + id);
  }

  updateQc(qc: any) {
    return this.httpClient.put(this.baseURL + "/api/qcReport/editqc", qc);
  }


  getDashboardStats(): Observable<any> {
    return this.httpClient.get(this.apiUrl);
  }



}
