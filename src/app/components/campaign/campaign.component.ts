import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { catchError, tap, throwError } from 'rxjs';


@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrl: './campaign.component.scss'
})
export class CampaignComponent implements OnInit {

  onReload() {
    this.ngOnInit();
    console.log("load");
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
        this.campaignList = result;
        this.totalElements = result.length; // Update total elements if necessary
      },
      (error) => {
        console.error('Error occurred while searching campaigns:', error);
      }
    );
  }

  
  successMessage: string = '';
  errorMessage: string = '';
  validationMessage: string = '';

  constructor(public http: HttpService, private route: Router) { }

  ngOnInit(): void {
    this.getCampaignListWithPagination();
  }

  campaignForm: FormGroup = new FormGroup({
    campaignName: new FormControl('', Validators.required),
    campaignId: new FormControl('', Validators.required),
    callTarget: new FormControl(Validators.required)
  })

  onSubmit() {

    if (this.campaignForm.invalid) {
      this.validationMessage = 'Request failed! Please fill up all the necessary fields';
      this.successMessage = '';
      this.errorMessage = '';
      return;
    }

    this.validationMessage = '';
    this.successMessage = '';
    this.errorMessage = '';

    console.log(this.campaignForm.value);

    this.http.addData(this.campaignForm.value).pipe(
      tap(() => {
        this.successMessage = '1 campaign successfully added!';
        this.errorMessage = '';
        this.getAll();
        this.campaignForm.reset();
      }),
      catchError((error) => {
        this.successMessage = '';
        this.errorMessage = 'Campaign Addition failed!';
        this.validationMessage = '';
        return throwError(error);
      })
    ).subscribe();

  }

  campaignList: any[] = [];
  
  getAll() {
    this.http.getAll().subscribe((result: any) => {
      this.campaignList = result;
      this.campaignList.forEach(campaign => {
        this.getDataCount(campaign.campaignName);
      });
    });
  }

  delete(id: any) {
    this.http.deleteById(id).subscribe((result: any) => {
      this.getAll();
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
  searchTerm: string = '';

  pageSize: number = 10; // Default page size
  offset: number = 0; // Starting offset
  totalElements: number = 0;
  totalPages!: number;

  getCampaignListWithPagination(){
    this.http.getCampaignListWithPagination(this.offset, this.pageSize).subscribe((result: any) => {
      if (result && result.response && result.response.content) {
        this.campaignList = result.response.content;
        this.totalElements = result.response.totalElements;
        this.totalPages = result.response.totalPages;
        this.pageSize = result.response.size;
        this.campaignList.forEach(campaign => {
          this.getDataCount(campaign.campaignName);
        });
      } else {
        console.error('Unexpected response structure:', result);
        this.campaignList = []; // Handle the case where content is not found
      }
    }, (error) => {
      console.error('Error fetching paginated agent list:', error);
    });
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
}
