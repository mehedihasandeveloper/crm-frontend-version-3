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
  totalDataTables: number | undefined;
  totalInbound: number | undefined;
  totalOutbound: number | undefined;
  campaignData: { campaignTitle: string, totalLeads: number, generatedLeads: number, calledLeads: number }[] = [];

  constructor(public http: HttpService) {}
 
  ngOnInit(): void {
    this.fetchTotalAgents();
    this.fetchTotalCampaigns();
    this.fetchTotalDataTables();
    this.fetchTotalInbound();
    this.fetchTotalOutbound();
    this.fetchCampaignData();
    
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

  fetchTotalDataTables(): void {
    this.http.getTotalDataTables().subscribe(
      (data) => {
        this.totalDataTables = data;
      },
      (error) => {
        console.error('Error fetching total data tables:', error);
      }
    );
  }

  
  fetchTotalInbound(): void {
    this.http.getTotalInbound().subscribe(
      (data) => {
        this.totalInbound = data;
      },
      (error) => {
        console.error('Error fetching total agents:', error);
      }
    );
  }

  
  fetchTotalOutbound(): void {
    this.http.getTotalOutbound().subscribe(
      (data) => {
        this.totalOutbound = data;
      },
      (error) => {
        console.error('Error fetching total agents:', error);
      }
    );
  }

  fetchCampaignData(): void {
    this.http.getCampaignData().subscribe(
      (data) => {
        console.log('Campaign Data:', data); // Add this to inspect the data
        this.campaignData = data;
      },
      (error) => {
        console.error('Error fetching campaign data:', error);
      }
    );
  }
  

}
