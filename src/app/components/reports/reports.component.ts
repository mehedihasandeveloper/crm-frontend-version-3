import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { CsvService } from '../../services/csv.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit{
  onReload() {
    this.ngOnInit();
    console.log("load");
  }
  constructor(public http: HttpService, private route: Router, private csvService: CsvService, private fb: FormBuilder) { }
  ngOnInit(): void {
    this.dataTablesForm = this.fb.group({
      campaignName: [''],
      date: [''],
      startDate: [''],
      endDate: ['']
    });
    this.getAll();
  }

  campaignList: any[] = [];
  dataTablesForm!: FormGroup;
  dataDates: string[] = [];
  showGenerateControls = false;
  showInitialControls = true;
  showGenerateControls1 = false;
  showInitialControls1 = true;

  getAll() {
    this.http.getAll().subscribe((result: any) => {
      this.campaignList = result;
    });
  }

  onCampaignSelected() {
    const campaignName = this.dataTablesForm.get('campaignName')?.value;
    if (campaignName) {
      this.http.getUniqueJoiningDates(campaignName).subscribe(data => {
        this.dataDates = data;
        this.showGenerateControls = true;
        this.showInitialControls = false;
      }, error => {
        console.error('Error fetching joining dates', error);
      });
    }
  }
  onFullReportSelected(){
    const campaignName = this.dataTablesForm.get('campaignName')?.value;
    if (campaignName) {
      this.http.getUniqueJoiningDates(campaignName).subscribe(data => {
        this.dataDates = data;
        this.showGenerateControls1 = true;
        this.showInitialControls1 = false;
      }, error => {
        console.error('Error fetching joining dates', error);
      });
    }
  }

  downloadFor_D() {
    const campaignName = this.dataTablesForm.get('campaignName')?.value;
    const date = this.dataTablesForm.get('date')?.value;

    // Perform actions with campaignName, name, and date
    console.log('Generating...');
    console.log('Campaign Name:', campaignName);
    console.log('Date:', date);

    this.csvService.downloadExcelFor_d(campaignName, date);
  }

  downloadFullReport(){
    const campaignName = this.dataTablesForm.get('campaignName')?.value;
    const startDate = this.dataTablesForm.get('startDate')?.value;
    const endDate = this.dataTablesForm.get('endDate')?.value;

    // Perform actions with campaignName, name, and date
    console.log('Generating...');
    console.log('Campaign Name:', campaignName);
    console.log('Date:', startDate);
    console.log('Date:', endDate);

    this.csvService.downloadExcelFullReport(campaignName, startDate, endDate);
  }

}
