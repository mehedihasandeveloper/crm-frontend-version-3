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
  onReload() {
    this.ngOnInit();
  }

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

  updateLeadData() {
    this.http.updateLeadByCellNumber(this.campaignName, this.cellNumber, this.leadData)
      .subscribe(response => {
        console.log('Lead data updated successfully:', response);
      }, error => {
        console.error('Error updating lead data:', error);
      });
  }

  textInput: string = '';      // For text input questions
  textAreaInput: string = '';  // For textarea questions
  plainTextInput: string = ''; // For plain text questions (default to 'N/A')


  //  selectedOption: string = '';  // For Select Option
  selectedOptions: string[] = [];  // For Multi Select Option
  // textInput: string = '';  // For Text Input
  numberInput: number = 0;  // For Number Input
  emailInput: string = '';  // For Email Input
  textareaInput: string = '';  // For Textarea

  // submitAnswer() {
  //   let answer;

  //   // Handle multiple select option answers
  //   if (this.currentQuestion.type === 'Multi Select Option') {
  //     answer = this.selectedOptions.join(',');  // Store multi-select options as comma-separated values
  //   } else {
  //     answer = this.selectedOption;
  //   }

  //   // Store the answer
  //   this.answers.push({
  //     questionId: this.currentQuestion.id,
  //     questionTitle: this.currentQuestion.title,
  //     answer: answer
  //   });

  //   // Update leadData with the answer
  //   this.leadData[this.currentQuestion.qno] = answer;

  //   // Handle logic to find the next question based on the selected answer
  //   const currentLogic = this.logicList.find(
  //     logic => logic.questionId == this.currentQuestion.id && logic.optionTitle == answer.split(',')[0]  // Only check the first option for logic in Multi Select Option
  //   );

  //   if (currentLogic) {
  //     const nextQuestionId = currentLogic.questionNoToShow;
  //     const nextQuestion = this.questionList.find(q => q.id == nextQuestionId);

  //     if (nextQuestion) {
  //       this.currentQuestion = nextQuestion;
  //       this.selectedOption = '';  // Reset for next question
  //       this.selectedOptions = [];

  //       if (currentLogic.isCompletedCall === "1") {
  //         this.leadData['is_called'] = '1';

  //         setTimeout(() => {
  //           console.log('Survey Answers:', this.answers);
  //           this.updateLeadData();
  //           alert('Survey Ended');
  //           this.ngOnInit();
  //         }, 500);
  //       }
  //     }
  //   } else {
  //     this.questionIndex++;
  //     this.displayNextQuestion();
  //   }

  //   // Check for end of survey
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


  submitAnswer() {
    let answer;

    // Handle multiple select option answers
    if (this.currentQuestion.type === 'Multi Select Option') {
      answer = this.selectedOptions.join(',');  // Store multi-select options as comma-separated values
    } else {
      answer = this.selectedOption;
    }

    // Store the answer
    this.answers.push({
      questionId: this.currentQuestion.id,
      questionTitle: this.currentQuestion.title,
      answer: answer
    });

    // Update leadData with the answer
    this.leadData[this.currentQuestion.qno] = answer;

    // Find the logic for the current question
    let currentLogic;
    if (this.currentQuestion.type === 'Textarea' || this.currentQuestion.type === 'Text Input') {
      // For Textarea or Text Input, use only the questionId to find the next question
      currentLogic = this.logicList.find(
        logic => logic.questionId == this.currentQuestion.id
      );
    } else {
      // For other types of questions (e.g., Select Option), match both questionId and optionTitle
      currentLogic = this.logicList.find(
        logic => logic.questionId == this.currentQuestion.id && logic.optionTitle == answer.split(',')[0]  // Only check the first option for logic in Multi Select Option
      );
    }

    if (currentLogic) {
      const nextQuestionId = currentLogic.questionNoToShow;
      const nextQuestion = this.questionList.find(q => q.id == nextQuestionId);

      if (nextQuestion) {
        this.currentQuestion = nextQuestion;
        this.selectedOption = '';  
        this.selectedOptions = [];

        if (currentLogic.isCompletedCall === "1") {
          this.leadData['is_called'] = '1';

          setTimeout(() => {
            console.log('Survey Answers:', this.answers);
            this.updateLeadData();
            alert('Survey Ended');
            this.ngOnInit();
          }, 500);
        }
      }
    } else {
      this.questionIndex++;
      this.displayNextQuestion();
    }

    // Check for end of survey
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

 
}
