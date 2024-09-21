import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetLogicsComponent } from './set-logics.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpService } from '../../services/http.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

// Mock services and dependencies
const httpServiceMock = {
  getToSetLogicQuestions: (campaignName: string) => of([]), // Mock method with an empty observable
  logicData: (formData: any[]) => of({}) // Mock method with an empty observable
};

const activatedRouteMock = {
  queryParams: of({ data: JSON.stringify({ id: 1, title: 'Test Title', campaignId: 'Campaign123', options: 'Option1,Option2' }) })
};

describe('SetLogicsComponent', () => {
  let component: SetLogicsComponent;
  let fixture: ComponentFixture<SetLogicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, // Import HttpClientModule
        ReactiveFormsModule, // Import ReactiveFormsModule for form handling
        RouterTestingModule // Use RouterTestingModule for routing tests
      ],
      declarations: [SetLogicsComponent],
      providers: [
        { provide: HttpService, useValue: httpServiceMock }, // Provide mocked HttpService
        { provide: ActivatedRoute, useValue: activatedRouteMock } // Provide mocked ActivatedRoute
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SetLogicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});