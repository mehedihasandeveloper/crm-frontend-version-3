
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-logic-setting',
  templateUrl: './logic-setting.component.html',
  styleUrl: './logic-setting.component.scss'
})
export class LogicSettingComponent implements OnInit{

  constructor(public http: HttpService, private route: Router){}

  logicList: any[] = [];
  ngOnInit(): void {
    this.getAll();
  }

  getAll(){
   this.http.getAll().subscribe((result: any) =>{
    this.logicList = result;
    this.logicList.forEach(logic => {
      this.getDataCount(logic.campaignName);
    });
    console.log(this.logicList);
   })
  }
  dataCounts: { [key: string]: number } = {}; // New property to store data counts
  getDataCount(campaignDataTable: string): void {
    this.http.getNumberOfData(campaignDataTable).subscribe(
      (count: number) => {
        this.dataCounts[campaignDataTable] = count;
        console.log('Number of data for', campaignDataTable, ':', count);
      },
      (error) => {
        console.error('Error fetching data count for', campaignDataTable, error);
        this.dataCounts[campaignDataTable] = 0; // Handle error by setting count to 0
      }
    );
  }

  onPageChange(newOffset: number) {
    this.offset = newOffset;
    this.getCampaignListWithPagination();
  }
  onPageSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.offset = 0; // Reset to the first page
    this.getCampaignListWithPagination();
  }

  searchTerm: string = '';

  pageSize: number = 10; // Default page size
  offset: number = 0; // Starting offset
  totalElements: number = 0;
  totalPages!: number;

  getCampaignListWithPagination(){
    this.http.getCampaignListWithPagination(this.offset, this.pageSize).subscribe((result: any) => {
      if (result && result.response && result.response.content) {
        this.logicList = result.response.content;
        this.totalElements = result.response.totalElements;
        this.totalPages = result.response.totalPages;
        this.pageSize = result.response.size;
      } else {
        console.error('Unexpected response structure:', result);
        this.logicList = []; // Handle the case where content is not found
      }
    }, (error) => {
      console.error('Error fetching paginated agent list:', error);
    });
  }

  onSearch(event: any) {
    const searchTerm = event.target.value.trim();
    if (searchTerm) {
      this.searchCampaign(searchTerm);
    } else {
      this.getCampaignListWithPagination();
    }
  }
  
  searchCampaign(term: string) {
    this.http.searchCampaigns(term).subscribe(
      (result: any) => {
        console.log(result); // Debugging output
        this.logicList = result;
        this.totalElements = result.length; // Update total elements if necessary
      },
      (error) => {
        console.error('Error occurred while searching campaigns:', error);
      }
    );
  }

}
