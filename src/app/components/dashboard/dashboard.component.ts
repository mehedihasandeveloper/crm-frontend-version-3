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
    this.fetchDashboardData();
    
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

  
  stats: any[] = [
    // { label: 'User Groups', value: '' },
    { label: 'Calls Waiting', value: 0 },
    { label: 'Agents Logged In', value: 0 },
    { label: 'Agents In Calls', value: 0 },
    { label: 'Agents Waiting', value: 0 },
    { label: 'Agents Paused', value: 0 },
    { label: 'Agents In Dead Calls', value: 0 },
    { label: 'Agents In Dispo', value: 0 },
    { label: 'Agents In Dial', value: 0 }
  ];

  fetchDashboardData() {
    this.http.getDashboardStats().subscribe(response => {
      const data = response.data;  // Adjust this based on the actual API response structure

      this.stats = [
        // { label: 'User Groups', value: data.user_groups },
        { label: 'Calls Waiting', value: data.calls_waiting },
        { label: 'Agents Logged In', value: data.agents_logged_in },
        { label: 'Agents In Calls', value: data.agents_in_calls },
        { label: 'Agents Waiting', value: data.agents_waiting },
        { label: 'Agents Paused', value: data.agents_paused },
        { label: 'Agents In Dead Calls', value: data.agents_in_dead_calls },
        { label: 'Agents In Dispo', value: data.agents_in_dispo },
        { label: 'Agents In Dial', value: data.agents_in_dial }
      ];

    }, error => {
      console.error('Error fetching dashboard data', error);
    });
  }

}
