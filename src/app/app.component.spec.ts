import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HttpService } from './services/http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StorageService } from './services/storage.service';
import { TopNavbarComponent } from './materials/top-navbar/top-navbar.component';

const storageServiceMock = {
  isLoggedIn: () => true,
  getUser: () => ({ roles: [{ roleName: 'user', roleDescription: 'User' }], userName: 'user' })
};

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        HttpClientTestingModule
      ],
      declarations: [
        AppComponent,
        TopNavbarComponent // Declare here if not part of another module
      ],
      providers: [
        { provide: StorageService, useValue: storageServiceMock },
        HttpService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should not render title', () => {
    fixture.detectChanges(); // Ensure DOM updates after initialization
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')).toBeNull(); // Check that `<h1>` is not present
  });
});