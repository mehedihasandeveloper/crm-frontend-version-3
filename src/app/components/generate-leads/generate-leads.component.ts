import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { CsvService } from '../../services/csv.service';

@Component({
  selector: 'app-generate-leads',
  templateUrl: './generate-leads.component.html',
  styleUrl: './generate-leads.component.scss'
})
export class GenerateLeadsComponent implements OnInit{
  onReload() {
    this.ngOnInit();
    console.log("load");
  }
  dataTablesForm!: FormGroup;
  campaignList: any[] = [];
  dataDates: string[] = [];
  selectedFile: File | null = null;
  uploadMessage: string = '';
  uploadFailedMessage: string = '';
  uploadProgress: number = 0;
  leadList: any[] = [];
  isLoggedIn = false;
  isUploading = false;
  selectedCampaignName: string | null = null;
  constructor(private fb: FormBuilder, public http: HttpService, private route: Router, private csvService: CsvService) {
    this.dataTablesForm = this.fb.group({
      campaignName: [''],
      date: ['']
    });
   }
  ngOnInit(): void {
    this.addTargetSelectorControls();
    this.getAll();
    this.onCampaignSelected();
  }

  onCampaignSelect(event: any): void {
    this.selectedCampaignName = event.target.value; // Capture the selected campaign name
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  getAll() {
    this.http.getAll().subscribe((result: any) => {
      this.campaignList = result;
    });
  }

  // Assuming you have campaignList defined
  showGenerateControls = false;
  

  onCampaignSelected() {
    const campaignName = this.dataTablesForm.get('campaignName')?.value;
    if (campaignName) {
      // Fetch unique dates
      this.http.getUniqueJoiningDates(campaignName).subscribe(data => {
        this.dataDates = data;
        this.showGenerateControls = true;
      }, error => {
        console.error('Error fetching joining dates', error);
      });
  
      // Fetch target selectors
      this.http.getUniqueTargetSelector(campaignName).subscribe(data => {
        this.targetSelectors = data;
        this.addTargetSelectorControls();
      }, error => {
        console.error('Error fetching target selectors', error);
      });
    }
  }

  targetSelectors: string[] = [];

  
  addTargetSelectorControls() {
    this.targetSelectors.forEach(selector => {
      this.dataTablesForm.addControl(selector, this.fb.control(''));
    });
  }
  
  generate() {
    const campaignName = this.dataTablesForm.get('campaignName')?.value;
    const date = this.dataTablesForm.get('date')?.value;
    const callTargets = this.targetSelectors.reduce((acc, selector) => {
      const value = this.dataTablesForm.get(selector)?.value;
      if (value) {
        acc[selector] = value;
      }
      return acc;
    }, {} as { [key: string]: number });
  
    // Log the payload and params
    console.log('Table Name:', campaignName);
    console.log('Data Date:', date);
    console.log('Call Targets:', callTargets);
  
    // Call the service method
    this.http.generateLeads(campaignName, date, callTargets).subscribe(
      response => {
        console.log('Data updated successfully', response);
        alert('Data generated successfully!');
        this.route.navigateByUrl('/leads');

      },
      error => {
        console.error('Error updating data', error);
        alert('Failed!');
      }
    );
  }
  
  campaignForm: FormGroup = new FormGroup({
    campaignName: new FormControl('', Validators.required)
  });

  onUpload() {
    const tableName = this.campaignForm.get('campaignName')?.value;
    if (this.selectedFile && tableName) {
      this.isUploading = true;
      this.csvService.uploadCsv(this.selectedFile, tableName).subscribe(
        response => {
          if (response.status === 'progress') {
            this.uploadProgress = response.message;
          } else if (response.status === 'response') {
            this.uploadMessage = response.message;
            this.uploadProgress = 0;
            this.resetUploadForm();
          }
        },
        error => {
          console.error('Error uploading file:', error);
          this.uploadFailedMessage = 'Error uploading file';
          this.isUploading = false;
        },
        () => {
          this.isUploading = false;
        }
      );
    } else {
      console.error('No file selected or campaign not selected');
      this.uploadFailedMessage = 'No file selected or campaign not selected';
      this.uploadProgress = 0;
    }
  }

  resetUploadForm() {
    this.campaignForm.reset();
    const fileInput = document.getElementById('formFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    this.selectedFile = null;
  }

  downloadCsvFile(tableName: string) {
    this.csvService.downloadCsv(tableName).subscribe(
      (data: Blob) => {
        const blob = new Blob([data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${tableName}_columns.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error => {
        console.error('Error downloading CSV:', error);
        // Handle error
      }
    );
  }

}
