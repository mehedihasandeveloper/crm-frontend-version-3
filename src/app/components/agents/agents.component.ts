import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CsvService } from '../../services/csv.service';
import { catchError, tap, throwError } from 'rxjs';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrl: './agents.component.scss'
})
export class AgentsComponent implements OnInit {
  onReload() {
    this.ngOnInit();
    console.log("load");
  }

  successMessage: string = '';
  errorMessage: string = '';
  validationMessage: string = '';
  isLoggedIn = false;
  username: string = '';
  roles: any[] = [];
  constructor(public http: HttpService, private route: Router, private csvService: CsvService, private storageService: StorageService) { }
  @ViewChild('fileInput') fileInput!: ElementRef;
  agentList!: any[];
  selectedFile: File | null = null;

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.username = this.storageService.getUser().userName;
      if (this.username == "admin") {
        this.getAgentListWithPagination();
      }
      this.roles = this.storageService.getUser().roles;

    } else {
      this.route.navigateByUrl("/login");
    }


  }

  agentForm: FormGroup = new FormGroup({
    type: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    agentId: new FormControl('', Validators.required),
    cellNumber: new FormControl,
    joiningDate: new FormControl,
    bankAcNumber: new FormControl,
    nagadAcNumber: new FormControl,
    bkashAcNumber: new FormControl
  })

  resetForm() {
    this.agentForm.value('')
  }

  onSubmit() {
    this.http.addAgent(this.agentForm.value).pipe(
      tap(() => {
        this.successMessage = '1 agent successfully added!';
        this.errorMessage = '';
        this.ngOnInit();
        this.agentForm.reset();
      }),
      catchError((error) => {
        this.successMessage = '';
        this.errorMessage = 'Data Addition failed!';
        return throwError(error);
      })
    ).subscribe();
  }

  deleteAgent(id: any) {
    this.http.deleteAgent(id).subscribe((result: any) => {
      this.ngOnInit();
    })
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onUpload(): void {
    if (this.selectedFile) {
      this.http.uploadFile(this.selectedFile).subscribe(
        response => {
          console.log('Upload successful!', response);
          this.ngOnInit();
          this.selectedFile = null;
          this.fileInput.nativeElement.value = '';
          this.validationMessage = '';
          this.successMessage = response.body + " agents added successfully!";
          this.errorMessage = '';
        },
        error => {
          console.error('Upload failed!', error);
          this.validationMessage = '';
          this.successMessage = '';
          this.errorMessage = 'Data upload failed!';
        }
      );
    }
  }

  downloadCSV() {
    this.csvService.downloadCSV().subscribe((blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = 'agentDataFormat.csv';
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  searchTerm: string = '';

  pageSize: number = 10;
  offset: number = 0;
  totalElements: number = 0;
  totalPages!: number;

  getAgentListWithPagination() {
    this.http.getAgentListWithPagination(this.offset, this.pageSize).subscribe((result: any) => {
      if (result && result.response && result.response.content) {
        this.agentList = result.response.content;
        this.totalElements = result.response.totalElements;
        this.totalPages = result.response.totalPages;
        this.pageSize = result.response.size;
      } else {
        console.error('Unexpected response structure:', result);
        this.agentList = [];
      }
    }, (error) => {
      console.error('Error fetching paginated agent list:', error);
    });
  }

  onPageSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.offset = 0;
    this.getAgentListWithPagination();
  }

  onPageChange(newOffset: number) {
    this.offset = newOffset;
    this.getAgentListWithPagination();
  }

  onSearch(event: any) {
    const searchTerm = event.target.value.trim();

    if (searchTerm) {
      this.searchAgents(searchTerm);
    } else {
      this.getAgentListWithPagination();
    }
  }

  searchAgents(term: string) {
    this.http.searchAgents(term).subscribe((result: any) => {
      this.agentList = result;
      this.totalElements = result.length;
    });
  }
}
