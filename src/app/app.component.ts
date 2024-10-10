import { Component, OnInit } from '@angular/core';
import { StorageService } from './services/storage.service';
import { Router } from '@angular/router';
import { HttpService } from './services/http.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(private storageService: StorageService, private route: Router, public http: HttpService) { }
  title = 'fifoProject';
  campaignName: string | null = '';
  isLoggedIn = false;
  private roles: any[] = [{ roleName: '', roleDescription: '' }];
  username?: string;
  isAdmin = true;
  isAgent = true;
  isQc = false;
  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.roles;
      this.username = user.userName; 
      if(this.username == "admin"){
        this.isAdmin = false;
      }else if (this.username === undefined){
        this.isAgent = false;
      }else{
        this.isQc = true;
        this.isAdmin = false;
        this.isAgent = false;
      }
    }
  }
  deleteCampaignName(): void {
    localStorage.removeItem('campaignName');
  }

}


