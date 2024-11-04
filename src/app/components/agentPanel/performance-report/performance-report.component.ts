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
  qcList: any[] = [];
  reportFiles: any[] = [];
  audioSource: string | null = null;
  agentComments: { [id: number]: string } = {};

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
          this.qcList.forEach((qc) => {
            this.agentComments[qc.id] = ''; 
          });
          // Fetch all report files
          this.getAllReportFiles();
        },
        error: (error) => {
          console.error('Error fetching QC records:', error);
        },
      });
    } else {
      console.warn('Agent ID is null; cannot fetch QC records');
    }
  }

  getAllReportFiles(): void {
    this.http.getAllReportFiles().subscribe({
      next: (files) => {
        this.reportFiles = files;
        // Match report files with qcList
        this.qcList.forEach((qc) => {
          const matchedFile = this.reportFiles.find(
            (file) => file.qcReport.id === qc.id
          );
          if (matchedFile) {
            qc.fileName = matchedFile.fileName;
            const date = qc.callDate; 
            qc.fullPath = `${date}/${matchedFile.fileName}`; 
          } else {
            qc.fileName = null;
          }
        });
      },
      error: (error) => {
        console.error('Error fetching report files:', error);
      },
    });
  }

  encodeFileName(filePath: string): string {
    return encodeURIComponent(filePath);
  }

  togglePlay(audioPlayer: HTMLAudioElement): void {
    console.log(audioPlayer);
    
    if (audioPlayer.paused) {
      audioPlayer.play();
    } else {
      audioPlayer.pause();
    }
  }

  toggleRaiseConcern(qc: any): void {
    qc.raiseConcern = !qc.raiseConcern;
    if (qc.raiseConcern) {
      alert('Concern Raised');
    } else {
      alert('Concern Removed');
    }
  }

  submitReview(qc: any): void {
    const agentComment = this.agentComments[qc.id];
    console.log('Submitting Review for QC ID:', qc.id, 'with Comment:', agentComment);

    const reviewData = {
      callDate: qc.callDate,
      consumerNumber: qc.consumerNumber,
      total: qc.total,
      suggestion: qc.suggestion,
      qcInspector: qc.qcInspector,
      agreed: qc.agreed,
      raiseConcern: qc.raiseConcern,
      qcId: qc.id,
      comment: agentComment || '', 
    };

    console.log('Review Data:', reviewData); 

    this.http.submitReview(reviewData).subscribe({
      next: (response) => {
        console.log('Review submitted successfully:', response);
        alert('Review submitted successfully!');
        this.ngOnInit(); // Refresh the data
      },
      error: (error) => {
        console.error('Error submitting review:', error);
        alert('Failed to submit review');
      },
    });
  }
}
