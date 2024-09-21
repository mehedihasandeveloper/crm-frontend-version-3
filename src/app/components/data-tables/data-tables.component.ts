import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-data-tables',
  templateUrl: './data-tables.component.html',
  styleUrl: './data-tables.component.scss'
})
export class DataTablesComponent implements OnInit {
  onReload() {
    this.ngOnInit();
    console.log("load");
  }
  dataTablesForm!: FormGroup;
  isLoggedIn = false;
  constructor(public http: HttpService, private route: Router, private fb: FormBuilder, private storageService: StorageService) { }
  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.isLoggedIn){

    }
    this.dataTablesForm = this.fb.group({
      campaignName: ['', Validators.required]
    });
    this.getDataTablesListWithPagination();
    this.getAllCampaigns();
  }
  
  campaignList!: any[];
  
  getAllCampaigns() {
    this.http.getAll().subscribe((result: any) => {
      this.campaignList = result;
    });
  }

  dataTablesList: any[] = [];
  
  getAll() {
    this.http.getAllDataTables().subscribe((result: any) => {
      this.dataTablesList = result;
    })
  }

  delete(id: any, campaign: any) {
    console.log(id);
    
    this.http.deleteDataTableById(id).subscribe((result: any) => {
      this.getAll();
    })

    this.http.deleteCampaignTable(campaign).subscribe((result: any) => {
      this.getAll();
    })
  }

  onSearch(event: any) {
    const searchTerm = event.target.value.trim();
    if (searchTerm) {
      this.searchDataTables(searchTerm);
    } else {
      this.getDataTablesListWithPagination();
    }
  }

  getDataTablesListWithPagination() {
    this.http.getDataTablesListWithPagination(this.offset, this.pageSize).subscribe((result: any) => {
      if (result && result.response && result.response.content) {
        this.dataTablesList = result.response.content;
        this.totalElements = result.response.totalElements;
        this.totalPages = result.response.totalPages;
        this.pageSize = result.response.size;
      } else {
        console.error('Unexpected response structure:', result);
        this.dataTablesList = []; // Handle the case where content is not found
      }
    }, (error) => {
      console.error('Error fetching paginated agent list:', error);
    });
  }


  searchTerm: string = '';

  pageSize: number = 10; // Default page size
  offset: number = 0; // Starting offset
  totalElements: number = 0;
  totalPages!: number;

  searchDataTables(term: string) {
    this.http.searchDataTables(term).subscribe(
      (result: any) => {
        console.log(result); // Debugging output
        this.dataTablesList = result;
        this.totalElements = result.length; // Update total elements if necessary
      },
      (error) => {
        console.error('Error occurred while searching campaigns:', error);
      }
    );
  }

  onPageSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.offset = 0; // Reset to the first page
    this.getDataTablesListWithPagination();
  }

  onPageChange(newOffset: number) {
    this.offset = newOffset;
    this.getDataTablesListWithPagination();
  }
}
