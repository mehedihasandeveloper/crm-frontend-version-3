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
    console.log(this.username);
  }

  onSubmit() {
    this.cellNumber = this.leadForm.value.cellNumber;
    this.campaignName = this.leadForm.value.campaignName;
    this.date = this.leadForm.value.date;
    this.getLeadbyCellNumber();
    this.searchFiles();

  }

  searchFiles(): void {
    this.http.searchMP3Files(this.date, this.cellNumber, 0, 10).subscribe({
      next: (response) => {
        this.mp3FilePage = response;

        const agentIds: string[] = [];
        this.mp3FilePage.content.forEach((file: any) => {
          agentIds.push(file.agentId);
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

  playFile(fileName: string, agentId: string): void {
    this.audioSource = null;
    this.selectedAgentId = agentId;
    const fullPath = `${this.date}/${fileName}`;
    setTimeout(() => {
      this.audioSource = `http://43.231.78.77:5010/download-mp3?fileName=${encodeURIComponent(fullPath)}`;
    }, 50);
  }
  metadataLoaded: boolean = false;
  onLoadedMetadata(event: any): void {
    const duration = event.target.duration;
    this.selectedDuration = `${Math.floor(duration)}`;  
    this.metadataLoaded = true;  
    console.log('Audio Duration:', this.selectedDuration);
  }

  assignAgentId(): void {
    if (this.metadataLoaded) {
      alert("Successful Call Detected!");
      console.log('Selected Agent ID:', this.selectedAgentId);
      console.log('Selected Duration:', this.selectedDuration);
    } else {
      alert("Duration not available yet!");
      console.log('Duration not available yet');
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
      console.log(result);
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
          console.log('Lead data updated successfully:', response);
          this.isEditMode = false;
          alert('Lead data updated successfully!');
        },
        error: (error) => {
          console.error('Error updating lead data:', error);
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
    agentGrade: '',
    suggestion: ''
  };

  total: number = 0;

  calculateTotal() {
    this.total =
      this.form.greetings + this.form.liveliness + this.form.pronunciation +
      this.form.mumbling + this.form.pace + this.form.pitch +
      this.form.courtesy + this.form.holdProcess + this.form.takingPermission +
      this.form.acknowledgementAndFollowUp + this.form.poorObjectionAndNegotiationSkill +
      this.form.crm + this.form.closing + this.form.fatal;
  }

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
      agentId: this.selectedAgentId

    };

    this.http.addQcReport(reportData).subscribe(
      (response) => {
        alert('Report submitted successfully!');
        this.route.navigateByUrl('/viewQcReports');
        console.log(response);
        
      },
      (error) => {
        alert('There was an error submitting the report.');
      }
    );
  }

}
