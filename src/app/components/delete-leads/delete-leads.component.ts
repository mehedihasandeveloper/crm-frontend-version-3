import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { CsvService } from '../../services/csv.service';

@Component({
  selector: 'app-delete-leads',
  templateUrl: './delete-leads.component.html',
  styleUrl: './delete-leads.component.scss'
})
export class DeleteLeadsComponent implements OnInit{
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
  campaignForm: FormGroup = new FormGroup({
    campaignName: new FormControl('', Validators.required)
  });
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  constructor(private fb: FormBuilder, public http: HttpService, private route: Router, private csvService: CsvService) { }
  ngOnInit(): void {
    this.dataTablesForm = this.fb.group({
      campaignName: [''],
      date: ['']
    });
    this.getAll();
  }

  onCampaignSelect(event: any): void {
    this.selectedCampaignName = event.target.value; // Capture the selected campaign name
  }

  dataTablesForm!: FormGroup;
  // campaignList: any[] = [];
  showGenerateControls = false;
  showInitialControls = true;
  dataDates: string[] = [];
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

  deleteLeads() {
    const campaignName = this.dataTablesForm.get('campaignName')?.value;
    // const callTarget = this.dataTablesForm.get('callTarget')?.value;
    const date = this.dataTablesForm.get('date')?.value;

    // Perform actions with campaignName, name, and date
    // console.log('Generating...');
    // console.log('Campaign Name:', campaignName);
    // console.log('Date:', date);

    this.http.deleteLeads(campaignName, date).subscribe(
      response => {
        // console.log('Data deleted successfully:', response);
        alert('Data deleted successfully!')
        this.ngOnInit();
      },
      error => {
        console.error('Error deleting data:', error);
        alert('Error deleting data!')
      }
    );
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
