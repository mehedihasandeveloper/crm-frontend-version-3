import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-crm',
  templateUrl: './crm.component.html',
  styleUrl: './crm.component.scss'
})
export class CRMComponent implements OnInit {
  onReload() {
    this.ngOnInit();
    console.log("load");
  }
  
  leadForm: FormGroup;
  campaignName: string = '';
  cellNumber!: string;
  questionList: any[] = [];
  logicList: any[] = [];
  leadData: any;
  currentQuestion: any;
  selectedOption: string = '';
  questionIndex: number = 0;
  surveyEnded: boolean = false;
  answers: any[] = [];
  localStorage: string | null = '';

  constructor(private activatedRoute: ActivatedRoute, public http: HttpService) {
    this.leadForm = new FormGroup({
      cellNumber: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.localStorage = localStorage.getItem('campaignName');
    this.activatedRoute.queryParams.subscribe(params => {
      this.campaignName = params['campaignName'] || this.localStorage;
    });
    this.getAllSurveyQuestions();
    this.cellNumber = '';
    this.leadForm.reset();
    this.questionList = [];
    this.logicList = [];
    this.leadData = null;
    this.currentQuestion = null;
    this.selectedOption = '';
    this.questionIndex = 0;
    this.surveyEnded = false;
    this.answers = [];
  }

  // onSubmit() {
  //   this.cellNumber = this.leadForm.value.cellNumber;
  //   this.getLeadbyCellNumber();
  // }

  // getLeadbyCellNumber() {
  //   this.http.getLeadByCellNumber(this.campaignName, this.cellNumber).subscribe((result: any) => {
  //     this.leadData = result;
  //     this.loadQuestionsAndLogic();
  //   });
  // }
  
  // loadQuestionsAndLogic() {
  //   this.getAllSurveyQuestions();
  //   this.getAllCampaignLogic();
  // }

  // getAllSurveyQuestions(): void {
  //   this.http.getToSetLogicQuestions(this.campaignName).subscribe((result: any) => {
  //     this.questionList = result;
  //     console.log(result);

  //     this.displayNextQuestion();
  //   });
  // }

  // getAllCampaignLogic() {
  //   this.http.getAllCampaignLogic(this.campaignName).subscribe((result: any) => {
  //     this.logicList = result;
  //   });
  // }

  // displayNextQuestion() {
  //   if (this.questionIndex < this.questionList.length) {
  //     this.currentQuestion = this.questionList[this.questionIndex];
  //   } else {
  //     this.currentQuestion = null;
  //   }
  // }

  // submitAnswer() {
  //   this.answers.push({
  //     questionId: this.currentQuestion.id,
  //     questionTitle: this.currentQuestion.title,
  //     answer: this.selectedOption
  //   });
  //   this.leadData[this.currentQuestion.qno] = this.selectedOption;
  //   const currentLogic = this.logicList.find(
  //     logic => logic.questionId == this.currentQuestion.id && logic.optionTitle == this.selectedOption
  //   );
  //   if (currentLogic) {
  //     const nextQuestionId = currentLogic.questionNoToShow;
  //     const nextQuestion = this.questionList.find(q => q.id == nextQuestionId);
  //     if (nextQuestion) {
  //       this.currentQuestion = nextQuestion;
  //       this.selectedOption = '';
  //       if (currentLogic.isCompletedCall === "1") {
  //         this.leadData['is_called'] = '1';
  //         setTimeout(() => {
  //           console.log('Survey Answers:', this.answers);
  //           this.updateLeadData();
  //           alert('Survey Ended');
  //           this.ngOnInit();
  //         }, 500);
  //       }
  //     } else {
        
  //     }
  //   } else {
  //     this.questionIndex++;
  //     this.displayNextQuestion();
  //   }

  //   if (currentLogic && currentLogic.isCompletedCall === "0") {
  //     this.leadData['is_called'] = '';
  //     this.surveyEnded = true;
  //     setTimeout(() => {
  //       console.log('Survey Answers:', this.answers);
  //       this.updateLeadData();
  //       alert('Survey Ended');
  //       this.ngOnInit();
  //     }, 500);
  //   }
  // }
  
  // updateLeadData() {
  //   this.http.updateLeadByCellNumber(this.campaignName, this.cellNumber, this.leadData)
  //     .subscribe(response => {
  //       console.log('Lead data updated successfully:', response);
  //     }, error => {
  //       console.error('Error updating lead data:', error);
  //     });
  // }

  onSubmit() {
    this.cellNumber = this.leadForm.value.cellNumber;
    this.getLeadbyCellNumber();
  }
  
  getLeadbyCellNumber() {
    this.http.getLeadByCellNumber(this.campaignName, this.cellNumber).subscribe(
      (response: any) => {
        if (response.message === "Lead is not generated") {
          alert("Lead was not generated!"); 
          this.leadData = null;
        } else {
          this.leadData = response;
          this.loadQuestionsAndLogic();
        }
      },
      error => {
        console.error('Error fetching lead data:', error);
      }
    );
  }
  
  loadQuestionsAndLogic() {
    this.getAllSurveyQuestions();
    this.getAllCampaignLogic();
  }
  
  getAllSurveyQuestions(): void {
    this.http.getToSetLogicQuestions(this.campaignName).subscribe((result: any) => {
      this.questionList = result;
      console.log(result);
      this.displayNextQuestion();
    });
  }
  
  getAllCampaignLogic() {
    this.http.getAllCampaignLogic(this.campaignName).subscribe((result: any) => {
      this.logicList = result;
    });
  }
  
  displayNextQuestion() {
    if (this.questionIndex < this.questionList.length) {
      this.currentQuestion = this.questionList[this.questionIndex];
    } else {
      this.currentQuestion = null;
    }
  }
  
  submitAnswer() {
    this.answers.push({
      questionId: this.currentQuestion.id,
      questionTitle: this.currentQuestion.title,
      answer: this.selectedOption
    });
  
    this.leadData[this.currentQuestion.qno] = this.selectedOption;
  
    const currentLogic = this.logicList.find(
      logic => logic.questionId == this.currentQuestion.id && logic.optionTitle == this.selectedOption
    );
  
    if (currentLogic) {
      const nextQuestionId = currentLogic.questionNoToShow;
      const nextQuestion = this.questionList.find(q => q.id == nextQuestionId);
  
      if (nextQuestion) {
        this.currentQuestion = nextQuestion;
        this.selectedOption = '';
  
        if (currentLogic.isCompletedCall === "1") {
          this.leadData['is_called'] = '1';
  
          setTimeout(() => {
            console.log('Survey Answers:', this.answers);
            this.updateLeadData();
            alert('Survey Ended');
            this.ngOnInit();
          }, 500);
        }
      } else {
        // Handle the case where no next question is found
      }
    } else {
      this.questionIndex++;
      this.displayNextQuestion();
    }
  
    if (currentLogic && currentLogic.isCompletedCall === "0") {
      this.leadData['is_called'] = '';
      this.surveyEnded = true;
      setTimeout(() => {
        console.log('Survey Answers:', this.answers);
        this.updateLeadData();
        alert('Survey Ended');
        this.ngOnInit();
      }, 500);
    }
  }
  
  updateLeadData() {
    this.http.updateLeadByCellNumber(this.campaignName, this.cellNumber, this.leadData)
      .subscribe(response => {
        console.log('Lead data updated successfully:', response);
      }, error => {
        console.error('Error updating lead data:', error);
      });
  }
  

}
