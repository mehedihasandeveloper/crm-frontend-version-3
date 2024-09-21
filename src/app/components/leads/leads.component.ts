import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CsvService } from '../../services/csv.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../services/storage.service';


@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.scss',
  providers: [DatePipe] // Add DatePipe to the providers

})
export class LeadsComponent implements OnInit {
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
  constructor(public http: HttpService, private route: Router, private datePipe: DatePipe, private csvService: CsvService, private storageService: StorageService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.isLoggedIn) {
      this.getDataTablesListWithPagination();
      this.getAllCampaign();
    } else {
      this.route.navigateByUrl('/login')
    }

  }

  onCampaignSelect(event: any): void {
    this.selectedCampaignName = event.target.value; // Capture the selected campaign name
  }


  getAll() {
    this.http.getAllDataTables().subscribe((result: any) => {
      this.leadList = result.map((lead: any) => {
        lead.createAt = this.datePipe.transform(lead.createAt, 'yyyy-MM-dd HH:mm:ss'); // Format date
        return lead;
      });
    });
  }

  getAllCampaign() {
    this.http.getAll().subscribe((result: any) => {
      this.campaignList = result;
    });
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
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


  onSearch(event: any) {
    const searchTerm = event.target.value.trim();
    if (searchTerm) {
      this.searchDataTables(searchTerm);
    } else {
      this.getDataTablesListWithPagination();
    }
  }

  getDataTablesListWithPagination() {
    this.http.getDataTablesListWithPagination(this.offset, this.pageSize).subscribe((result: any) => {
      if (result && result.response && result.response.content) {
        this.leadList = result.response.content;
        this.totalElements = result.response.totalElements;
        this.totalPages = result.response.totalPages;
        this.pageSize = result.response.size;
      } else {
        console.error('Unexpected response structure:', result);
        this.leadList = []; // Handle the case where content is not found
      }
    }, (error) => {
      console.error('Error fetching paginated agent list:', error);
    });
  }


  searchTerm: string = '';
  pageSize: number = 10; // Default page size
  offset: number = 0; // Starting offset
  totalElements: number = 0;
  totalPages!: number;

  searchDataTables(term: string) {
    this.http.searchDataTables(term).subscribe(
      (result: any) => {
        console.log(result); // Debugging output
        this.leadList = result;
        this.totalElements = result.length; // Update total elements if necessary
      },
      (error) => {
        console.error('Error occurred while searching campaigns:', error);
      }
    );
  }

  onPageSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.offset = 0; // Reset to the first page
    this.getDataTablesListWithPagination();
  }

  onPageChange(newOffset: number) {
    this.offset = newOffset;
    this.getDataTablesListWithPagination();
  }
}
