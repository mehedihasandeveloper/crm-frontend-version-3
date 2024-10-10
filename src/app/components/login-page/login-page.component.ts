import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translateX(0)'
      })),
      state('out', style({
        transform: 'translateX(-100%)'
      })),
      transition('in => out', [
        animate('300ms ease-in-out')
      ]),
      transition('out => in', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class LoginPageComponent implements OnInit {

  constructor(private fb: FormBuilder, public http: HttpService, private route: Router, private storageService: StorageService) {
    this.agentLoginForm = this.fb.group({
      loginShift: ['', Validators.required],
      agentId: ['', Validators.required],
      password: ['', Validators.required],
      campaignName: ['', Validators.required]
    });

    this.adminLoginForm = this.fb.group({
      adminId: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
   
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.username = this.storageService.getUser().userName;
      if (this.username == "admin") {
        this.route.navigateByUrl("/agents");
      } 
      
      else if (this.username === undefined) {
        this.route.navigateByUrl("/CRM");
      }

      else {
        this.route.navigateByUrl("/qcChecking");
      }
      this.roles = this.storageService.getUser().roles;
      this.getAllCampaign();
      this.campaignName = localStorage.getItem('campaignName');
    }
    this.getAllCampaign();
  }

  isLoggedIn = false;
  campaignList: any[] = [];
  validationMessage: string = '';
  campaignName: string | null = '';
  isRegistering = false;
  isAgentLogin: boolean = true;
  agentLoginForm: FormGroup;
  adminLoginForm: FormGroup;
  username: string = '';
  isLoginFailed = false;
  roles: any[] = [];
  errorMessage = '';

  deleteCampaignName(): void {
    localStorage.removeItem('campaignName');
  }

  activateRegistering() {
    this.isRegistering = true;
  }

  toggleForm() {
    this.isRegistering = !this.isRegistering;
  }

  getAllCampaign() {
    this.http.getAll().subscribe((result: any) => {
      this.campaignList = result;
    });
  }

  navigateToViewFullCRM(): void {
    const campaignName = this.agentLoginForm.get('campaignName')?.value;
    this.route.navigate(['/viewFullCRM'], { queryParams: { campaignName } });
  }

  navigateToCRM(): void {
    const campaignName = this.agentLoginForm.get('campaignName')?.value;
    this.route.navigate(['/CRM'], { queryParams: { campaignName } });
  }

  toggleLogin() {
    this.isAgentLogin = !this.isAgentLogin;
    this.errorMessage = ''
  }

  onAgentSubmit() {
    if (this.agentLoginForm.valid) {
      const { agentId, password } = this.agentLoginForm.value;

      const timeoutId = setTimeout(() => {
        this.errorMessage = 'Login failed! Wrong username or password.';
        this.isLoginFailed = true;
      }, 10000);

      this.http.loginAsAgent(agentId, password).subscribe({
        next: data => {
          clearTimeout(timeoutId);
          // this.route.navigateByUrl('/CRM')
          this.reloadPage();
          this.storageService.saveUser(data);
          this.isLoggedIn = true;
          this.roles = this.storageService.getUser().roles;
          // this.username = this.storageService.getUser().userName;
          localStorage.setItem('campaignName', this.agentLoginForm.value.campaignName);
          localStorage.setItem('username', this.agentLoginForm.value.agentId);
        },
        error: err => {
          clearTimeout(timeoutId);
          this.errorMessage = 'Login Failed!';
          this.isLoginFailed = true;
        }
      });
    }
  }

  onAdminSubmit() {
    if (this.adminLoginForm.valid) {
      const { adminId, password } = this.adminLoginForm.value;

      const timeoutId = setTimeout(() => {
        this.errorMessage = 'Login failed! Wrong username or password.';
        this.isLoginFailed = true;
      }, 7000);

      this.http.login(adminId, password).subscribe({
        next: data => {
          clearTimeout(timeoutId);
          this.reloadPage();
          this.storageService.saveUser(data);
          this.isLoggedIn = true;
          this.roles = this.storageService.getUser().roles;
          this.username = this.storageService.getUser().userName;
        },
        error: err => {
          clearTimeout(timeoutId);
          this.errorMessage = 'Login Failed!';
          this.isLoginFailed = true;
        }
      });
    }
  }

  reloadPage(): void {
    window.location.reload();
  }

}
