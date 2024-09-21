import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPageComponent } from './login-page.component';
import { StorageService } from '../../services/storage.service';
import { HttpService } from '../../services/http.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
// Mock services
const httpServiceMock = {
  getAll: () => of([]), // Mock the method with an empty observable
  loginAsAgent: (agentId: string, password: string) => of({}), // Mock login method
  login: (adminId: string, password: string) => of({}) // Mock admin login method
};

const storageServiceMock = {
  isLoggedIn: () => false, // Mock login status
  getUser: () => ({ userName: '', roles: [] }), // Mock user details
  saveUser: (user: any) => {} // Mock saving user details
};

const routerMock = {
  navigateByUrl: jasmine.createSpy('navigateByUrl')
};

const activatedRouteMock = {
  queryParams: of({}) // Mock queryParams observable
};

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, 
        ReactiveFormsModule,
        RouterTestingModule,
        NoopAnimationsModule // Add NoopAnimationsModule to avoid animation issues in tests
      ],
      declarations: [LoginPageComponent],
      providers: [
        { provide: HttpService, useValue: httpServiceMock },
        { provide: StorageService, useValue: storageServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock } // Ensure activatedRouteMock is provided correctly
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});