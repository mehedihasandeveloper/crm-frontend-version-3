import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopNavbarComponent } from './top-navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StorageService } from '../../services/storage.service';

const storageServiceMock = {
  isLoggedIn: () => true,
  getUser: () => ({ roles: [{ roleName: 'user', roleDescription: 'User' }], userName: 'user' }),
  clean: () => {}
};

describe('TopNavbarComponent', () => {
  let component: TopNavbarComponent;
  let fixture: ComponentFixture<TopNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, // For routing related tests
        HttpClientTestingModule // For HTTP related tests
      ],
      declarations: [TopNavbarComponent],
      providers: [
        { provide: StorageService, useValue: storageServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});