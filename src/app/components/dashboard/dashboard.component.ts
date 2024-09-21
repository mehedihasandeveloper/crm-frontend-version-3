import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  totalAgents: number | undefined;
  totalCampaigns: number | undefined;

  constructor(public http: HttpService) {}
 
  ngOnInit(): void {
    this.fetchTotalAgents();
    this.fetchTotalCampaigns();
  }

  fetchTotalAgents(): void {
    this.http.getTotalAgents().subscribe(
      (data) => {
        this.totalAgents = data;
      },
      (error) => {
        console.error('Error fetching total agents:', error);
      }
    );
  }

  fetchTotalCampaigns(): void {
    this.http.getTotalCampaigns().subscribe(
      (data) => {
        this.totalCampaigns = data;
      },
      (error) => {
        console.error('Error fetching total agents:', error);
      }
    );
  }

}
