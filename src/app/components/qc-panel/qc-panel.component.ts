import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-qc-panel',
  templateUrl: './qc-panel.component.html',
  styleUrl: './qc-panel.component.scss'
})
export class QcPanelComponent implements OnInit{
  campaignList: any[] = [];
  constructor(public http: HttpService, private route: Router, private storageService: StorageService) { }
  
  ngOnInit(): void {
    this.getAllCampaign();
  }

  getAllCampaign() {
    this.http.getAll().subscribe((result: any) => {
      this.campaignList = result;
    });
  }

}
