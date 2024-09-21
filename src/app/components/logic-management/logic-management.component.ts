import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../services/http.service';



@Component({
  selector: 'app-logic-management',
  templateUrl: './logic-management.component.html',
  styleUrl: './logic-management.component.scss'
})
export class LogicManagementComponent implements OnInit {

  campaignName: string = '';
  questionsList: any[] = [];

  constructor(private route: ActivatedRoute, public http: HttpService, private router: Router) { }

  ngOnInit(): void {
    this.campaignName = this.route.snapshot.paramMap.get('campaignName') || 'defaultCampaignName';
    this.getAllSurveyQuestions();
  }

  getAllSurveyQuestions(): void {
    this.http.getToSetLogicQuestions(this.campaignName).subscribe((result: any) => {
      this.questionsList = result;
      this.questionsList.forEach(question => {
        this.isLogicExists(question);
      });
    });
  }

  clearLogic(question: any): void {
    this.http.deleteLogic(question).subscribe((result: any) => {
      this.ngOnInit();
    });
  }

  isLogicExists(question: any): void {
    this.http.isLogicExists(question.id).subscribe((result: boolean) => {
      question.noLogicSet = !result;
      question.yesLogicSet = result;
    });
  }

  navigateToSetLogic(question: any): void {
    this.router.navigate(['/setLogics'], { queryParams: { data: JSON.stringify(question) } });
  }

  navigateToUpdateLogic(question: any): void {
    this.router.navigate(['/updateLogics'], { queryParams: { data: JSON.stringify(question) } });
  }
}
