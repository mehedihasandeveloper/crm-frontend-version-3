import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-set-logics',
  templateUrl: './set-logics.component.html',
  styleUrl: './set-logics.component.scss'
})
export class SetLogicsComponent implements OnInit {

  question: any;
  optionsArray: string[] = [];
  campaignName: string = '';
  questionsList: any[] = [];
  form: FormGroup;

  constructor(private route: ActivatedRoute, private http: HttpService, private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      formData: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        this.question = JSON.parse(params['data']);
        this.campaignName = this.question.campaignId;
        this.optionsArray = this.question.options ? this.question.options.split(',') : [''];
        this.initializeFormData();
        this.getAllSurveyQuestions();
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

  onSubmit(): void {
    const formData: FormData[] = this.formDataArray.value;
    this.http.logicData(formData).subscribe(response => {
      console.log('Form data submitted:', formData);
      console.log('Response:', response);
      this.router.navigate(['logicManagement', this.campaignName]);
    });
  }
  
}
