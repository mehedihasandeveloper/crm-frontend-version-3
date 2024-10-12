import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { Router } from '@angular/router';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-qc-records-client',
  templateUrl: './qc-records-client.component.html',
  styleUrl: './qc-records-client.component.scss'
})
export class QcRecordsClientComponent implements OnInit{
  qcList!: any[];
  pageSize: number = 10;
  offset: number = 0;
  totalElements: number = 0;
  totalPages!: number;
  username!: string;


  constructor(public http: HttpService, private route: Router, private storageService: StorageService) { }
  ngOnInit(): void {
    this.username = this.storageService.getUser().userName;
   this.getReportsByInspector();
  }


  getReportsByInspector(): void {
    this.http.getQcReportsClientByInspector(this.username, this.offset, this.pageSize).subscribe((result: any) => {
      if (result && result.response && result.response.content) {
        this.qcList = result.response.content;
        this.totalElements = result.response.totalElements;
        this.totalPages = result.response.totalPages;
        this.pageSize = result.response.size;
      } else {
        console.error('Unexpected response structure:', result);
        this.qcList = [];
      }
    }, (error) => {
      console.error('Error fetching paginated agent list:', error);
    });
  }
}
