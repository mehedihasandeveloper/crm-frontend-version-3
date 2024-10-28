import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from '../../../services/http.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-qc-reports',
  templateUrl: './qc-reports.component.html',
  styleUrl: './qc-reports.component.scss',
})
export class QcReportsComponent implements OnInit {
  reportForm!: FormGroup;
  dates: string[] = [];
  isReportSelected = false;
  selectedReport: string = '';

  constructor(private fb: FormBuilder, public http: HttpService) {}

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      reportName: [''],
      date: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  onReportTypeChange() {
    this.selectedReport = this.reportForm.get('reportName')?.value;
    this.isReportSelected = true;

    if (this.selectedReport !== 'Monthly Qc Summary') {
      if (
        this.selectedReport === 'Daily Qc Records (In-House)' ||
        this.selectedReport === 'Daily Qc Summary'
      ) {
        this.http.getUniqueDatesForReportingInHouse().subscribe({
          next: (dates: string[]) => {
            this.dates = dates;
            console.log(dates);

            console.log(this.selectedReport);

            this.reportForm.get('date')?.setValue(''); // Reset date selection
          },
          error: (error) => {
            console.error('Error fetching unique dates:', error);
          },
        });
      } else if (this.selectedReport === 'Daily Qc Records (Client)') {
        this.http.getUniqueDatesForReportingClient().subscribe({
          next: (dates: string[]) => {
            this.dates = dates;
            this.reportForm.get('date')?.setValue(''); // Reset date selection
          },
          error: (error) => {
            console.error('Error fetching unique dates:', error);
          },
        });
      }
    }
  }

  exportReport() {
    if (this.selectedReport === 'Daily Qc Records (In-House)') {
      this.downloadExcelInHouse(this.reportForm.value.date);
    } 
    else if (this.reportForm.value.reportName === 'Daily Qc Records (Client)') 
    {
      this.downloadExcelClient(this.reportForm.value.date);
    } 
    else if (this.selectedReport === 'Daily Qc Summary') 
    {
      this.downloadAgentSummariesExcel(this.reportForm.value.date);
    }else{
      this.downloadExcel(this.reportForm.value.startDate, this.reportForm.value.endDate);
    }
  }

  resetForm() {
    this.reportForm.reset();
    this.reportForm.get('reportName')?.setValue('');
    this.reportForm.get('date')?.setValue('');
    this.isReportSelected = false;
    this.selectedReport = '';
  }

  downloadExcelInHouse(date: string) {
    this.http.getQcRecordsInHouse(date).subscribe({
      next: (data) => {
        // Create a new array for ordered data
        const orderedData = data.map((item) => ({
          'Call Date': item.callDate,
          'Agent Name': item.agentName,
          Id: item.agentId,
          'Campaign Name': item.campaignName,
          'Consumer Number': item.consumerNumber,
          Duration: item.duration,
          'Greetings ( শুভেচ্ছা ) [Yes(0)/No(-5)]':
            item['Greetings ( শুভেচ্ছা ) [Yes(0)/No(-5)]'],
          'Liveliness(10) [Yes(10)/Need Improvement(5)/ No(0)]':
            item['Liveliness(10) [Yes(10)/Need Improvement(5)/ No(0)]'],
          'Pronunciation(10) [Yes(10)/Need Improvement(5)/ No(0)]':
            item['Pronunciation(10) [Yes(10)/Need Improvement(5)/ No(0)]'],
          'Mumbling(10) [Yes(10)/Need Improvement(5)/ No(0)]':
            item['Mumbling(10) [Yes(10)/Need Improvement(5)/ No(0)]'],
          'Pace(10) [Yes(10)/Need Improvement(5)/ No(0)]':
            item['Pace(10) [Yes(10)/Need Improvement(5)/ No(0)]'],
          'Pitch(10) [Yes(10)/Need Improvement(5)/ No(0)]':
            item['Pitch(10) [Yes(10)/Need Improvement(5)/ No(0)]'],
          'Courtesy(10) [Yes(10)/Need Improvement(5)/ No(0)]':
            item['Courtesy(10) [Yes(10)/Need Improvement(5)/ No(0)]'],
          'Hold Process(0) [Yes(0)/No(-5)]':
            item['Hold Process(0) [Yes(0)/No(-5)]'],
          'Taking Permission (10) [Yes(10)/ No(0)]':
            item['Taking Permission (10) [Yes(10)/ No(0)]'],
          'Acknowledgement and follow-up(10) [Yes(10)/ No(0)]':
            item['Acknowledgement and follow-up(10) [Yes(10)/ No(0)]'],
          'Poor objection & Negotiation skill(-20) [Yes(0.00)/Need Improvement(-10)/ No(-20.00)]':
            item[
              'Poor objection & Negotiation skill(-20) [Yes(0.00)/Need Improvement(-10)/ No(-20.00)]'
            ],
          'CRM(20) [Yes(20)/Need Improvement(10)/No(0)]':
            item['CRM(20) [Yes(20)/Need Improvement(10)/No(0)]'],
          'Closing [Yes(0)/ No(-5)]': item['Closing [Yes(0)/ No(-5)]'],
          'Fatal [Yes(-100)/ No(0)]': item['Fatal [Yes(-100)/ No(0)]'],
          'Fatal Reason': item.fatalReason,
          'EAS voice matched with report?': item.easVoiceMatchedWithReport,
          Total: item.total,
          'Agent Grade': item.agentGrade,
          Suggestion: item.suggestion,
          'QC By': item.qcInspector,
        }));

        // Convert ordered data to worksheet and then to workbook
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(orderedData);
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'QC Records');

        // Generate Excel file and trigger download
        const excelBuffer: any = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array',
        });
        const blob = new Blob([excelBuffer], {
          type: 'application/octet-stream',
        });
        saveAs(blob, `QC_Records_In-House_${date}.xlsx`);
      },
      error: (err) => {
        console.error('Error downloading QC records:', err);
      },
    });
  }

  downloadExcelClient(date: string) {
    this.http.getQcRecordsClient(date).subscribe({
      next: (data) => {
        // Create a new array for ordered data
        const orderedData = data.map((item) => ({
          'Call Date': item.callDate,
          'Agent Name': item.agentName,
          Id: item.agentId,
          'Campaign Name': item.campaignName,
          'Consumer Number': item.consumerNumber,
          Duration: item.duration,
          'Did agent use standard opening greeting?':
            item['Greetings ( শুভেচ্ছা ) [Yes(0)/No(-5)]'],
          'Was the quality of being active and enthusiastic exist in call?':
            item['Liveliness(10) [Yes(10)/Need Improvement(5)/ No(0)]'],
          'Did the agent speak aloud a word or sound according to the rules of the language?':
            item['Pronunciation(10) [Yes(10)/Need Improvement(5)/ No(0)]'],
          'Did the agent speak quietly and in a way that is not clear so that the words are difficult to understand?':
            item['Mumbling(10) [Yes(10)/Need Improvement(5)/ No(0)]'],
          'Did the agent maintain appropriate speaking speed (not so fast or not so slow) at call?':
            item['Pace(10) [Yes(10)/Need Improvement(5)/ No(0)]'],
          'Was the voice/tonality sound appropriate when the agent speak?':
            item['Pitch(10) [Yes(10)/Need Improvement(5)/ No(0)]'],
          'Did the agent maintain courtesy? (no avoiding tendency, Empathized/ sympathized/ apologized in a timely manner, Personalize the call with positive and helpful attitude, not lingered the call unnecessarily)':
            item['Courtesy(10) [Yes(10)/Need Improvement(5)/ No(0)]'],
          'Did the agent maintain hold duration(30 Sec) and hold etiquette?':
            item['Hold Process(0) [Yes(0)/No(-5)]'],
          "Did the agent take permission to book customer's time and share reason for call?":
            item['Taking Permission (10) [Yes(10)/ No(0)]'],
          'Did the agent acknowledge customer that call recording and survey data will be saved/ask for a follow up time?':
            item['Acknowledgement and follow-up(10) [Yes(10)/ No(0)]'],
          'Poor objection & Negotiation skill(-20)':
            item[
              'Poor objection & Negotiation skill(-20) [Yes(0.00)/Need Improvement(-10)/ No(-20.00)]'
            ],
          'Did the agent approached to complete the survey in correct way(maintained serial of survey and asked appropriate question)?':
            item['CRM(20) [Yes(20)/Need Improvement(10)/No(0)]'],
          'Did agent use unique closing?': item['Closing [Yes(0)/ No(-5)]'],
          'Fatal [Yes(-100)/ No(0)]': item['Fatal [Yes(-100)/ No(0)]'],
          'Fatal Reason': item.fatalReason,
          'EAS voice matched with report?': item.easVoiceMatchedWithReport,
          Total: item.total,
          'Agent Grade': item.agentGrade,
          Remarks: item.suggestion,
          'QC By': item.qcInspector,
        }));

        // Convert ordered data to worksheet and then to workbook
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(orderedData);
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'QC Records');

        // Generate Excel file and trigger download
        const excelBuffer: any = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array',
        });
        const blob = new Blob([excelBuffer], {
          type: 'application/octet-stream',
        });
        saveAs(blob, `QC_Records_Client_${date}.xlsx`);
      },
      error: (err) => {
        console.error('Error downloading QC records:', err);
      },
    });
  }

  downloadAgentSummariesExcel(callDate: string) {
    this.http.getAgentSummaries(callDate).subscribe({
      next: (data) => {
        const formattedData = data.map((item: any) => ({
          'Agent Name': item.agentName,
          'Agent Id': item.agentId,
          Red: item.red,
          Yellow: item.yellow,
          Blue: item.blue,
          Green: item.green,
          Remarks: item.suggestions,
        }));

        // Create worksheet and workbook
        const worksheet: XLSX.WorkSheet =
          XLSX.utils.json_to_sheet(formattedData);
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Agent Summaries');

        // Write to Excel and trigger download
        const excelBuffer: any = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array',
        });
        const blob = new Blob([excelBuffer], {
          type: 'application/octet-stream',
        });
        saveAs(blob, `Daily_Qc_Summary_${callDate}.xlsx`);
      },
      error: (err) => {
        console.error('Error fetching summaries:', err);
      },
    });
  }


  downloadExcel(startDate: string, endDate: string) {
    this.http.getAgentPerformanceSummary(startDate, endDate).subscribe((data) => {
      const formattedData = data.map((item) => {
        const row = {
          'Agent Name': item.agentName,
          'Agent Id': item.agentId,
          ...item.dailyAverages,
          'Sum': item.sum,
          'Count': item.count,
          'Average': item.average,
        };
        return row;
      });

      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Performance Summary');

      XLSX.writeFile(workbook, `Monthly_Qc_Summary_${startDate}_to_${endDate}.xlsx`);
    });
  }
}
