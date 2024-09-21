import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrl: './top-navbar.component.scss'
})
export class TopNavbarComponent {

  constructor(private storageService: StorageService, private route: Router) { }
  isLoggedIn = false;
  private roles: any[] = [{ roleName: '', roleDescription: '' }];
  username: string | null = '';
  agent: string | null = '';

  logOut() {
    this.storageService.clean();
    localStorage.removeItem('campaignName');
    window.location.reload();
  }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.roles;
      this.username = user.userName;
      this.agent = localStorage.getItem('username');
      this.updateClock();
      this.timer = setInterval(() => this.updateClock(), 1000);
    }
  }

  currentTime: string = '';
  private timer: any;

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private updateClock(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
  }
}
