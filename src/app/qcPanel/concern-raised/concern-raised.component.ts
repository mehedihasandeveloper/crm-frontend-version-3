import { Component } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { StorageService } from '../../services/storage.service';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-concern-raised',
  templateUrl: './concern-raised.component.html',
  styleUrl: './concern-raised.component.scss',
})
export class ConcernRaisedComponent {
  agentReviews: any[] = [];
  reportFiles: any[] = [];
  audioSource: string | null = null;

  constructor(
    public http: HttpService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loadAgentReviews();
    this.fetchReportFiles();
  }

  loadAgentReviews(): void {
    this.http.getAgentReviews().subscribe({
      next: (data) => {
        this.agentReviews = data;
      },
      error: (error) => {
        console.error('Error fetching agent reviews:', error);
      },
    });
  }

  fetchReportFiles(): void {
    this.http.getAllReportFiles().subscribe({
      next: (files) => {
        this.reportFiles = files;
  
        this.agentReviews.forEach((review) => {
          const matchedFile = this.reportFiles.find(file => file.qcReport.id === review.qcId);
          if (matchedFile) {
            const date = review.callDate;  // Assumes `callDate` is in the required format (e.g., `2024-10-30`)
            const fileName = `${date}/${matchedFile.fileName}`;
            review.voiceLog = `http://43.231.78.77:5020/download-mp3?fileName=${encodeURIComponent(fileName)}`;
            console.log("Constructed voiceLog URL:", review.voiceLog);
          } else {
            review.voiceLog = null;  // No file available
          }
        });
      },
      error: (error) => console.error('Error fetching report files:', error),
    });
  }
  

  encodeFileName(filePath: string): string {
    return encodeURIComponent(filePath);
  }

  

  performAction(review: any): void {
    const updateData = {
      isResolved: true,
      resolvedMessage: review.comment, // Assuming the textarea is for resolved message
    };

    this.http.updateReviewStatus(review.id, updateData).subscribe({
      next: (response) => {
        console.log('Review updated successfully:', response);
        alert('Review has been marked as resolved.');
        this.loadAgentReviews(); // Refresh the data after updating
      },
      error: (error) => {
        console.error('Error updating review:', error);
        alert('Failed to update review status.');
      },
    });
  }
  handleAudioError(voiceLog: string): void {
    console.error(`Failed to load audio file from URL: ${voiceLog}`);
  }
}
