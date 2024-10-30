import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { Router } from '@angular/router';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-performance-report',
  templateUrl: './performance-report.component.html',
  styleUrl: './performance-report.component.scss',
})
export class PerformanceReportComponent implements OnInit {
  agentId!: string | null;
  qcList!: any[];
  consumerDetailsList: { consumerNumber: string, callDate: string }[] = [];
  constructor(
    public http: HttpService,
    private route: Router,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.agentId = localStorage.getItem('username');

    if (this.agentId) {
      this.http.getQcRecordsByAgentId(this.agentId).subscribe({
        next: (data) => {
          this.qcList = data;
  
          // Map through qcList to extract consumerNumber and callDate
          this.consumerDetailsList = this.qcList.map(item => ({
            consumerNumber: item.consumerNumber,
            callDate: item.callDate
          }));
        },
        error: (error) => {
          console.error('Error fetching QC records:', error);
        }
      });
    } else {
      console.warn('Agent ID is null; cannot fetch QC records');
    }
}
}
