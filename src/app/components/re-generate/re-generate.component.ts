import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { StorageService } from '../../services/storage.service';
import { CsvService } from '../../services/csv.service';

@Component({
  selector: 'app-re-generate',
  templateUrl: './re-generate.component.html',
  styleUrl: './re-generate.component.scss'
})
export class ReGenerateComponent implements OnInit{
  onReload() {
    this.ngOnInit();
    console.log("load");
  }
  selectedFile: File | null = null;
  uploadMessage: string = '';
  uploadFailedMessage: string = '';
  uploadProgress: number = 0;
  leadList: any[] = [];
  campaignList: any[] = [];
  isLoggedIn = false;
  isUploading = false;
  selectedCampaignName: string | null = null;
  targetSelectors: string[] = [];
  constructor(private fb: FormBuilder, public http: HttpService, private route: Router, private storageService: StorageService, private csvService: CsvService) { 
    this.dataTablesForm = this.fb.group({
    campaignName: [''],
    date: ['']
  }); }
  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.isLoggedIn){
      // this.dataTablesForm = this.fb.group({
      //   campaignName: [''],
      //   callTarget: [''],
      //   date: ['']
      // });
      this.getAll();
    } else {
      this.route.navigateByUrl('/login');
    }
   
  }

  dataTablesForm!: FormGroup;
  dataDates: string[] = [];
  showGenerateControls = false;
  showInitialControls = true;

  onCampaignSelect(event: any): void {
    this.selectedCampaignName = event.target.value; // Capture the selected campaign name
  }

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
       // Fetch target selectors
       this.http.getUniqueTargetSelector(campaignName).subscribe(data => {
        this.targetSelectors = data;
        this.addTargetSelectorControls();
      }, error => {
        console.error('Error fetching target selectors', error);
      });
    }
  }
  addTargetSelectorControls() {
    this.targetSelectors.forEach(selector => {
      this.dataTablesForm.addControl(selector, this.fb.control(''));
    });
  }

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


  

  reGenerate() {
    const campaignName = this.dataTablesForm.get('campaignName')?.value;
    const date = this.dataTablesForm.get('date')?.value;
    const callTargets = this.targetSelectors.reduce((acc, selector) => {
      const value = this.dataTablesForm.get(selector)?.value;
      if (value) {
        acc[selector] = value;
      }
      return acc;
    }, {} as { [key: string]: number });

    // Call the service method to handle the HTTP request
    this.http.reGenerateLeads(campaignName, date, callTargets).subscribe(
      response => {
        console.log('Data updated successfully:', response);
      },
      error => {
        console.error('Error updating data:', error);
      }
    );
  }
  
  campaignForm: FormGroup = new FormGroup({
    campaignName: new FormControl('', Validators.required)
  });

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
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
