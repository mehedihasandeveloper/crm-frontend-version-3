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
  reportFiles: any[] = []; // Store report files
  audioSource: string | null = null;

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
            qc.fileName = matchedFile.fileName; // Add fileName to qc
  
            // Set the date from qc.callDate directly
            const date = qc.callDate; // Assuming qc.callDate is in a valid format (YYYY-MM-DD)
  
            // Create full path using the call date and fileName
            const fullPath = `${date}/${matchedFile.fileName}`;
            qc.fullPath = fullPath; // Optionally, add fullPath to qc for later use
          } else {
            qc.fileName = null; // Handle case where no matching file is found
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
    if (audioPlayer.paused) {
      audioPlayer.play();
    } else {
      audioPlayer.pause();
    }
  }

  playFile(fileName: string): void {
    const fullPath = fileName;  // Use fileName directly as fullPath
    this.audioSource = `http://43.231.78.77:5010/download-mp3?fileName=${this.encodeFileName(fullPath)}`;
  }

  preventDownload(event: Event): void {
    event.preventDefault(); // Prevents the right-click menu on the audio player
  }
  toggleRaiseConcern(qc: any): void {
    // Toggle the raiseConcern field
    qc.raiseConcern = !qc.raiseConcern;
  
    // Show notification based on the new status
    if (qc.raiseConcern) {
      alert("Concern Raised");
    } else {
      alert("Concern Removed");
    }
  }
  

  submitReview(qc: any): void {
    const reviewData = {
      callDate: qc.callDate,
      consumerNumber: qc.consumerNumber,
      total: qc.total,
      suggestion: qc.suggestion,
      qcInspector: qc.qcInspector,
      agreed: qc.agreed,
      raiseConcern: qc.raiseConcern,
      qcId: qc.id
    };

    this.http.submitReview(reviewData).subscribe({
      next: (response) => {
        console.log('Review submitted successfully:', response);
        alert('Review submitted successfully!');
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error submitting review:', error);
        alert('Failed to submit review');
      }
    });
  }
}
