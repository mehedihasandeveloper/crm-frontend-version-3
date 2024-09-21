import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../services/http.service';

@Component({
  selector: 'app-view-full-crm',
  templateUrl: './view-full-crm.component.html',
  styleUrl: './view-full-crm.component.scss'
})
export class ViewFullCRMComponent {
  campaignName: string = '';
  questionsList: any[] = [];
  constructor(private activatedRoute: ActivatedRoute, public http: HttpService) { }
  localStorage: string | null = '';
  ngOnInit(): void {
    this.localStorage = localStorage.getItem('campaignName');
    this.activatedRoute.queryParams.subscribe(params => {
      this.campaignName = params['campaignName'] || this.localStorage;
    });
    this.getAllSurveyQuestions();
  }

  getAllSurveyQuestions(): void {
    this.http.getToSetLogicQuestions(this.campaignName).subscribe((result: any) => {
      this.questionsList = result;
    });
  }
}
