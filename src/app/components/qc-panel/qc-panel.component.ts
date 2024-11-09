import { Component, OnInit } from '@angular/core';
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
  mp3FilePage!: any;
  directory = '';
  msisdn = '';
  page = 0;
  size = 10;
  errorMessage = '';
  isEditMode: boolean = false;
  username: string = '';
  selectedDuration: string = '';
  selectedAgentId: string = '';
  metadataLoaded: boolean = false;
  total: number = 0;
  agentGrade: string = '';
  totalMarks: number = 0;
  agentGradeMarks: string = '';
  tickGreen = false;
  selectedFileName: string | null = null;  // Holds the name of the file marked with a green tick

  constructor(public http: HttpService, private route: Router, private storageService: StorageService) {
    this.leadForm = new FormGroup({
      cellNumber: new FormControl('', Validators.required),
      campaignName: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.getAllCampaign();
    this.username = this.storageService.getUser().userName;
  }

  onSubmit() {
    this.cellNumber = this.leadForm.value.cellNumber;
    this.campaignName = this.leadForm.value.campaignName;
    this.date = this.leadForm.value.date;
    this.getLeadbyCellNumber();
    this.searchFiles();

  }

  // playFile(fileName: string, agentId: string): void {
  //   this.audioSource = null;
  //   this.selectedAgentId = agentId;
  //   const fullPath = `${this.date}/${fileName}`;
  //   setTimeout(() => {
  //     this.audioSource = `http://43.231.78.77:5010/download-mp3?fileName=${encodeURIComponent(fullPath)}`;
  //   }, 50);
  // }

  playFile(fileName: string, agentId: string): void {
    this.audioSource = null;
    this.selectedAgentId = agentId;
    this.selectedFileName = fileName;  // Set the file name when playing
    const fullPath = `${this.date}/${fileName}`;
    setTimeout(() => {
      this.audioSource = `https://voicelog.fifo-tech.com/download-mp3?fileName=${encodeURIComponent(fullPath)}`;
      console.log(this.audioSource);
    }, 50);

   
    
}


  searchFiles(): void {
    this.http.searchMP3Files(this.date, this.cellNumber, 0, 10).subscribe({
      next: (response) => {
        this.mp3FilePage = response;

        const agentIds: string[] = [];
        this.mp3FilePage.content.forEach((file: any) => {
          agentIds.push(file.agentId);
          const fullPath = `${this.date}/${file.fileName}`;
          this.loadAudioMetadata(fullPath, file);
        });

        if (agentIds.length === 1) {
          this.selectedAgentId = agentIds[0];
        }
        console.log('Agent IDs:', agentIds);
        console.log('selectedAgentId', this.selectedAgentId);
      },
      error: (error) => {
        this.errorMessage = `Error: ${error.message}`;
      }
    });
  }

  loadAudioMetadata(fullPath: string, file: any): void {
    const audio = new Audio(`https://voicelog.fifo-tech.com/download-mp3?fileName=${encodeURIComponent(fullPath)}`);
    audio.addEventListener('loadedmetadata', () => {
      const duration = audio.duration;
      file.duration = Math.floor(duration);
      console.log(`Duration of ${file.fileName}: ${file.duration} seconds`);
    });
  }


  onLoadedMetadata(event: any): void {
    const duration = event.target.duration;
    this.selectedDuration = `${Math.floor(duration)}`;
    this.metadataLoaded = true;
    console.log('Audio Duration:', this.selectedDuration);
  }

  // assignAgentId(): void {
  //   if (this.metadataLoaded) {
  //     this.tickGreen = true;
  //     alert("Successful Call Detected!");
  //     console.log('Selected Agent ID:', this.selectedAgentId);
  //     console.log('Selected Duration:', this.selectedDuration);
  //   } else {
  //     alert("Duration not available yet!");
  //     console.log('Duration not available yet');
  //   }
  // }

  assignAgentId(): void {
    if (this.metadataLoaded && this.selectedFileName) {  // Only proceed if metadata is loaded and a file is selected
      this.tickGreen = true;
      alert("Successful Call Detected!");
      console.log('Selected Agent ID:', this.selectedAgentId);
      console.log('Selected Duration:', this.selectedDuration);
      console.log('Selected File Name:', this.selectedFileName);  // Log the selected file name
    } else {
      alert("Duration not available yet!");
      console.log('Duration not available yet or no file selected');
    }
}


  getAllCampaign() {
    this.http.getAll().subscribe((result: any) => {
      this.campaignList = result;
    });
  }

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
          for (const key in response) {
            if (key.startsWith('Q') && response[key] !== undefined) {
              this.questions.push(key);
              this.answers.push(response[key]);
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

  loadQuestionsAndLogic() {
    this.getAllSurveyQuestions();
  }

  getAllSurveyQuestions(): void {
    this.http.getToSetLogicQuestions(this.campaignName).subscribe((result: any) => {
      this.questionList = result;
    });
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  saveChanges() {
    const updatedData: any = {};
    this.questions.forEach((questionKey, index) => {
      updatedData[questionKey] = this.answers[index];
    });

    this.http.updateLeadByCellNumber(this.campaignName, this.cellNumber, updatedData)
      .subscribe({
        next: (response) => {
          this.isEditMode = false;
          alert('Lead data updated successfully!');
        },
        error: (error) => {
          alert('Failed to update lead data. Please try again.');
        }
      });
  }

  form = {
    greetings: 0,
    liveliness: 0,
    pronunciation: 0,
    mumbling: 0,
    pace: 0,
    pitch: 0,
    courtesy: 0,
    holdProcess: 0,
    takingPermission: 0,
    acknowledgementAndFollowUp: 0,
    poorObjectionAndNegotiationSkill: 0,
    crm: 0,
    closing: 0,
    fatal: 0,
    fatalReason: '',
    easVoiceMatchedWithReport: '',
    suggestion: ''
  };

  form2 = {
    greetingsMarks: 0,
    livelinessMarks: 0,
    pronunciationMarks: 0,
    mumblingMarks: 0,
    paceMarks: 0,
    pitchMarks: 0,
    courtesyMarks: 0,
    holdProcessMarks: 0,
    takingPermissionMarks: 0,
    acknowledgementAndFollowUpMarks: 0,
    poorObjectionAndNegotiationSkillMarks: 0,
    crmMarks: 0,
    closingMarks: 0,
    fatalMarks: 0,
    fatalReasonMarks: '',
    easVoiceMatchedWithReportMarks: '',
    suggestionMarks: ''
  }


  calculateTotal() {
    this.total =
      this.form.greetings + this.form.liveliness + this.form.pronunciation +
      this.form.mumbling + this.form.pace + this.form.pitch +
      this.form.courtesy + this.form.holdProcess + this.form.takingPermission +
      this.form.acknowledgementAndFollowUp + this.form.poorObjectionAndNegotiationSkill +
      this.form.crm + this.form.closing + this.form.fatal;

    this.agentGrade = this.decideAgentGrade(this.total);

    this.totalMarks =
      this.form2.greetingsMarks + this.form2.livelinessMarks + this.form2.pronunciationMarks +
      this.form2.mumblingMarks + this.form2.paceMarks + this.form2.pitchMarks +
      this.form2.courtesyMarks + this.form2.holdProcessMarks + this.form2.takingPermissionMarks +
      this.form2.acknowledgementAndFollowUpMarks + this.form2.poorObjectionAndNegotiationSkillMarks +
      this.form2.crmMarks + this.form2.closingMarks + this.form2.fatalMarks;
      this.agentGradeMarks = this.decideAgentGrade(this.totalMarks);
  }

  decideAgentGrade(total: number) {
    if (total >= 90) {
      return 'Exceed Expectation';

    } else if (total >= 80) {
      return 'Meet Expectation';

    } else if (total >= 70) {
      return 'Average Expectation';

    } else {
      return 'Below Expectation';
    }
  }

  // submitReport() {
  //   this.calculateTotal();
  //   const reportData = {
  //     ...this.form,
  //     total: this.total,
  //     callDate: this.date,
  //     consumerNumber: this.cellNumber,
  //     campaignName: this.campaignName,
  //     qcInspector: this.username,
  //     duration: this.selectedDuration,
  //     agentId: this.selectedAgentId,
  //     agentGrade: this.agentGrade

  //   };

  //   const reportDataMarks = {
  //     ...this.form2,
  //     total: this.totalMarks,
  //     callDate: this.date,
  //     consumerNumber: this.cellNumber,
  //     campaignName: this.campaignName,
  //     qcInspector: this.username,
  //     duration: this.selectedDuration,
  //     agentId: this.selectedAgentId,
  //     agentGrade: this.agentGradeMarks
  //   };

  //   this.http.addQcReportForClient(reportDataMarks).subscribe(
  //     (response) => {
        
  //       this.http.addQcReport(reportData).subscribe(
  //         (response) => {       
  //         },
  //         (error) => {
  //         }
  //       );
  //       alert('Report submitted successfully!');
  //       this.route.navigateByUrl('/viewQcReports');
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   )
  // }


  submitReport() {
    this.calculateTotal();

    const reportData = {
      ...this.form,
      total: this.total,
      callDate: this.date,
      consumerNumber: this.cellNumber,
      campaignName: this.campaignName,
      qcInspector: this.username,
      duration: this.selectedDuration,
      agentId: this.selectedAgentId,
      agentGrade: this.agentGrade
    };

    this.http.addQcReport(reportData).subscribe(
      (response: any) => {
        // Submit file name with a green tick if it’s marked as successful
        if (this.tickGreen && this.selectedFileName) {  
          const reportFileData = {
            qcReport: { id: response.id },
            fileName: this.selectedFileName
          };

          this.http.addReportFile(reportFileData).subscribe(
            () => alert("File name stored successfully!"),
            error => console.error("Error storing file name:", error)
          );
        }

        alert('Report submitted successfully!');
        this.route.navigateByUrl('/viewQcReports');
      },
      error => console.error(error)
    );
}

}
