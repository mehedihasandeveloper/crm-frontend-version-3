import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Question } from '../../../model/Question';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrl: './edit-question.component.scss'
})
export class EditQuestionComponent implements OnInit{

  constructor(public http: HttpService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getByID(this.id);
  }
  id!: any;
  dataTablesForm!: FormGroup;
  question!: Question;

  questionForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    qno: new FormControl(''),
    title: new FormControl(''),
    type: new FormControl(''),
    options: new FormControl(''),
    instruction: new FormControl(''),
    campaignId: new FormControl(''),
    optionalValue: new FormControl(''),
    status: new FormControl(),
    createAt: new FormControl('')
  })

  updateQuestion() {
    this.http.updateQuestion(this.questionForm.value).subscribe((result: any) => {
      console.log('Updated Question:', result);
      this.router.navigateByUrl('/question');
    });
  }

  getByID(id: any) {
    this.http.getQuestionByID(id).subscribe((result: any) => {
      this.question = result;
      console.log(this.question);
      this.questionForm.setValue(result);
    });
  }
}
