import { HttpClient, HttpEventType, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor(private http: HttpClient) { }

  private agentURL = "http://localhost:8080/api/file";

  private excelURL = "http://localhost:8080/api/file/generateExcel";

  private excelFullReportURL = "http://localhost:8080/api/file/generateFullReportExcel";


  downloadCSV() {
    return this.http.get(this.agentURL + '/download/csv', { responseType: 'blob' });
  }
  
  downloadExcelFor_d(tableName: string, dataDate: string): void {
    const params = new HttpParams()
      .set('tableName', tableName)
      .set('dataDate', dataDate);

    this.http.get(this.excelURL, {
      params: params,
      responseType: 'blob'
    }).subscribe(response => {
     
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      saveAs(blob, 'for_d_report.xlsx');
    }, error => {
      console.error('Download error:', error);
    });
  }

  downloadExcelFullReport(tableName: string, startDate: string, endDate: string,): void {
    const params = new HttpParams()
      .set('tableName', tableName)
      .set('startDate', startDate)
      .set('endDate', endDate);

    this.http.get(this.excelFullReportURL, {
      params: params,
      responseType: 'blob'
    }).subscribe(response => {
     
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      saveAs(blob, 'full_report.xlsx');
    }, error => {
      console.error('Download error:', error);
    });
  }


  downloadCsv(tableName: string): Observable<Blob> {
    const url = `${this.agentURL}/download/columns/csv?tableName=${tableName}`;
    return this.http.get<Blob>(url, {
      responseType: 'blob' as 'json', 
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<Blob>) => {
        return response.body as Blob;
      })
    );
  }

  uploadCsv(file: File, tableName: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('tableName', tableName);

    const headers = new HttpHeaders();
    const req = new HttpRequest('POST', `${this.agentURL}/uploadCsv`, formData, {
      headers: headers,
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const percentDone = event.total ? Math.round(100 * event.loaded / event.total) : 0;
          return { status: 'progress', message: percentDone };
        } else if (event instanceof HttpResponse) {
          return { status: 'response', message: event.body };
        } else {
          return { status: 'other', message: event };
        }
      })
    );
  }
}
