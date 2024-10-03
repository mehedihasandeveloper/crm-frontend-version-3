import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-qc-panel',
  templateUrl: './qc-panel.component.html',
  styleUrl: './qc-panel.component.scss'
})
export class QcPanelComponent implements OnInit {
  audioSource: string | undefined | null;
  campaignList: any[] = [];
  questionList: any[] = [];
  questionAnswers: any[] = [];
  questions: any[] = [];
  answers: any[] = [];
  leadForm: FormGroup;
  cellNumber!: string;
  campaignName!: string;
  date!: string;
  leadData: any;
  numberExist: boolean = false;
  mp3FilePage!: any;  // Variable to store the response
  directory = '';             // You can bind these to form controls in the HTML
  msisdn = '';
  page = 0;
  size = 10;                  // Default page size
  errorMessage = '';
  constructor(public http: HttpService, private route: Router, private storageService: StorageService) {
    this.leadForm = new FormGroup({
      cellNumber: new FormControl('', Validators.required),
      campaignName: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.getAllCampaign();
    // this.audioElement.nativeElement.src = '../../../../public/audio2.mp3';
    // this.audioElement.nativeElement.src = 'assets/audio2.mp3'; // Update the path if necessary

  }

  onSubmit() {
    this.cellNumber = this.leadForm.value.cellNumber;
    this.campaignName = this.leadForm.value.campaignName;
    this.date = this.leadForm.value.date;
    console.log(this.cellNumber);
    console.log(this.campaignName);
    console.log(this.date);
    this.getLeadbyCellNumber();
    this.searchFiles();

  }


  playFile(fileName: string): void {
    const fullPath = `${this.date}/${fileName}`;
    this.audioSource = null;
    setTimeout(() => {
      this.audioSource = `http://43.231.78.77:5010/download-mp3?fileName=${encodeURIComponent(fullPath)}`;
    }, 50);
  }

  searchFiles(): void {
    this.http.searchMP3Files(this.date, this.cellNumber, 0, 10).subscribe({
      next: (response) => {
        this.mp3FilePage = response;
        console.log(response);
        
      },
      error: (error) => {
        this.errorMessage = `Error: ${error.message}`;
      }
    });
  }

  getAllCampaign() {
    this.http.getAll().subscribe((result: any) => {
      this.campaignList = result;
    });
  }

  // getLeadbyCellNumber() {
  //   this.http.getLeadByCellNumber(this.campaignName, this.cellNumber).subscribe(
  //     (response: any) => {
  //       if (response.message === "Lead is not generated") {
  //         alert("Lead was not generated!");
  //         this.leadData = null;
  //       } else {
  //         this.leadData = response;
  //         console.log(response);

  //         // Separate arrays for questions (Q1, Q2, ...) and their corresponding answers
  //         this.questions = [];
  //         this.answers = [];

  //         // Loop through the response and get all question-answer pairs dynamically
  //         for (const key in response) {
  //           if (key.startsWith('Q') && response[key] !== undefined) {
  //             this.questions.push(key);        // Store the question keys (Q1, Q2, ...)
  //             this.answers.push(response[key]); // Store the corresponding answers
  //           }
  //         }

  //         this.loadQuestionsAndLogic();
  //         this.numberExist = true;
  //       }
  //     },
  //     error => {
  //       console.error('Error fetching lead data:', error);
  //     }
  //   );
  // }




  loadQuestionsAndLogic() {
    this.getAllSurveyQuestions();

  }

  getAllSurveyQuestions(): void {
    this.http.getToSetLogicQuestions(this.campaignName).subscribe((result: any) => {
      this.questionList = result;
      console.log(result);

    });
  }

  @ViewChild('audio') audioElement!: ElementRef<HTMLAudioElement>;

  currentTime = 0;
  audioDuration = 0;

  playAudio() {
    this.audioElement.nativeElement.play();
  }

  pauseAudio() {
    this.audioElement.nativeElement.pause();
  }

  rewindAudio() {
    this.audioElement.nativeElement.currentTime -= 10;
  }

  forwardAudio() {
    this.audioElement.nativeElement.currentTime += 10;
  }

  initializeAudio() {
    this.audioDuration = this.audioElement.nativeElement.duration;
    this.updateCurrentTime(); // Start updating current time
  }

  updateCurrentTime() {
    this.audioElement.nativeElement.ontimeupdate = () => {
      this.currentTime = this.audioElement.nativeElement.currentTime;
    };
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  seekAudio(event: Event) {
    const target = event.target as HTMLInputElement;
    this.audioElement.nativeElement.currentTime = Number(target.value);
  }




  editingMode: boolean = false; // Track the editing mode
  editing: boolean[] = []; // Array to track which cell is being edited



  getLeadbyCellNumber() {
    this.http.getLeadByCellNumber(this.campaignName, this.cellNumber).subscribe(
      (response: any) => {
        if (response.message === "Lead is not generated") {
          alert("Lead was not generated!");
          this.leadData = null;
        } else {
          this.leadData = response;
          console.log(response);

          this.questions = [];
          this.answers = [];
          this.editing = [];

          for (const key in response) {
            if (key.startsWith('Q') && response[key] !== undefined) {
              this.questions.push(key);
              this.answers.push(response[key]);
              this.editing.push(false);
            }
          }

          this.loadQuestionsAndLogic();
          this.numberExist = true;
        }
      },
      error => {
        console.error('Error fetching lead data:', error);
      }
    );
  }

  // Activate edit mode for the row
  editRow() {
    this.editingMode = true;
  }

  // Save the edited row and send to the backend
  saveRow() {
    this.editingMode = false;

    // Create an updated leadData object
    const updatedLeadData = { ...this.leadData };

    this.questions.forEach((question, index) => {
      updatedLeadData[question] = this.answers[index];
    });

    // Call the service method to update lead data
    this.http.updateLeadByCellNumber(this.campaignName, this.cellNumber, updatedLeadData)
      .subscribe(
        (response) => {
          console.log('Lead data updated successfully:', response);
          alert('Lead data has been updated');
        },
        (error) => {
          console.error('Error updating lead data:', error);
        }
      );
  }

  // Enable editing for a specific cell
  editCell(index: number) {
    this.editing[index] = true;
  }

}
