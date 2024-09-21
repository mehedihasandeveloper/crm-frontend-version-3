import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-update-logic',
  templateUrl: './update-logic.component.html',
  styleUrl: './update-logic.component.scss'
})
export class UpdateLogicComponent implements OnInit {
  question: any;
  optionsArray: string[] = [];
  campaignName: string = '';
  questionsList: any[] = [];
  form: FormGroup;

  constructor(private route: ActivatedRoute, private http: HttpService, private fb: FormBuilder, private router: ActivatedRoute) {
    this.form = this.fb.group({
      formData: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // this.id = this.route.snapshot.params['id'];
    // console.log(this.id);
    // this.getByLogicByQuestionId(this.id);
    // this.getLogic();
    // this.getAllSurveyQuestions();
    
    this.route.queryParams.subscribe(params => {
     
      if (params['data']) {
        this.question = JSON.parse(params['data']);
        this.campaignName = this.question.campaignId;
        this.optionsArray = this.question.options ? this.question.options.split(',') : [''];
        this.initializeFormData();
        this.getAllSurveyQuestions();
        // this. getByLogicByQuestionId(this.id);
      }
    });
  }

  get formDataArray(): FormArray {
    return this.form.get('formData') as FormArray;
  }

  initializeFormData(): void {
    const formArray = this.formDataArray;
    formArray.clear(); // Clear existing form data

    this.optionsArray.forEach(option => {
      formArray.push(this.fb.group({
        optionTitle: [option],
        questionNoToShow: [''],
        isCompletedCall: [''],
        questionId: [this.question.id],
        campaignId: [this.question.campaignId]
      }));
    });
  }

  getAllSurveyQuestions(): void {
    this.http.getToSetLogicQuestions(this.campaignName).subscribe((result: any) => {
      this.questionsList = result;
      console.log(this.questionsList);
    });
  }
  id: any;
  logicList: any[] = [];
  getLogic(): void {
    if (this.id) {
      this.http.getLogicByQuestionId(this.id).subscribe(
        (data: any[]) => {
          this.logicList = data;
        },
        (error) => {
          console.error('Error fetching logic:', error);
        }
      );
    }
  }

  onSubmit(): void {
    const formData: FormData[] = this.formDataArray.value;
    this.http.updateLogic(formData).subscribe(response => {
      console.log('Form data submitted:', formData);
      console.log('Response:', response);
    });
  }

}
