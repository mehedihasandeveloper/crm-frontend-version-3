import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-create-questions',
  templateUrl: './create-questions.component.html',
  styleUrls: ['./create-questions.component.scss']
})
export class CreateQuestionsComponent implements OnInit {
  onReload() {
    this.ngOnInit();
    console.log("load");
  }
  
  campaignList: any[] = [];
  isLoggedIn = false;
  constructor(private fb: FormBuilder, public http: HttpService, private route: Router, private storageService: StorageService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.isLoggedIn){
      this.dataTablesForm = this.fb.group({
        campaignName: ['', Validators.required],
        dataTable: ['', Validators.required],
        numberOfField: ['', Validators.required],
        questions: this.fb.array([])
      });
      this.getDataTablesAll();
      this.getAllCampaign();
    }else{
      this.route.navigateByUrl('/login');
    }
   
  }

  isGoClicked: boolean = false;
  dataTablesList: any[] = [];
  dataTablesForm!: FormGroup;

  get questions(): FormArray {
    return this.dataTablesForm.get('questions') as FormArray;
  }

  getDataTablesAll() {
    this.http.getAllDataTables().subscribe((result: any) => {
      this.dataTablesList = result;
    });
  }
  getAllCampaign() {
    this.http.getAll().subscribe((result: any) => {
      this.campaignList = result;
    });
  }

  onReset() {
    this.dataTablesForm.reset();
    this.questions.clear();
    this.dataTablesForm.controls['campaignName'].enable();
    this.dataTablesForm.controls['numberOfField'].enable();
    this.isGoClicked = false;
  }

  onGenerateAndSubmit() {
    if (this.dataTablesForm.valid) {
      const formData = this.dataTablesForm.value;
      const numberOfFields = formData.numberOfField;
      this.generateFields(numberOfFields);

      this.dataTablesForm.controls['campaignName'].disable();
      this.dataTablesForm.controls['numberOfField'].disable();
      this.isGoClicked = true;
    } else {
      console.error('Form is invalid');
    }
  }

  generateFields(number: number) {
    this.questions.clear();
    for (let i = 0; i < number; i++) {
      this.questions.push(this.fb.group({
        title: ['', Validators.required],
        type: ['', Validators.required],
        options: [''],
        optionalValue: [''],
        instruction: ['']
      }));
    }
  }

  saveQuestions() {
    const campaignId = this.dataTablesForm.get('campaignName')?.value;
    const questionsData = this.dataTablesForm.value.questions.map((question: any) => ({
      ...question,
      campaignId
    }));
console.log(questionsData);

    this.http.addQuestions(questionsData).subscribe(response => {
      console.log('Questions saved successfully', response);
      alert('Questions saved successfully');
      this.route.navigateByUrl("/question");
      // Handle success response
    }, error => {
      alert('Error saving questions');
      console.error('Error saving questions', error);
      // Handle error response
    });
  }
}



