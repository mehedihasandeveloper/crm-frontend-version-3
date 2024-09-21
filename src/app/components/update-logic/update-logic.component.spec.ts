import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLogicComponent } from './update-logic.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

// Mock services
const httpServiceMock = {
  getToSetLogicQuestions: () => of([]), // Mock method with an empty observable
  getLogicByQuestionId: () => of([]), // Mock method with an empty observable
  updateLogic: (formData: any) => of({}) // Mock method with an empty observable
};

const activatedRouteMock = {
  queryParams: of({ data: JSON.stringify({ campaignId: 'testCampaign', options: 'opt1,opt2', id: '1' }) })
};

describe('UpdateLogicComponent', () => {
  let component: UpdateLogicComponent;
  let fixture: ComponentFixture<UpdateLogicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule], // Import ReactiveFormsModule for form handling
      declarations: [UpdateLogicComponent],
      providers: [
        { provide: HttpService, useValue: httpServiceMock }, // Provide mocked HttpService
        { provide: ActivatedRoute, useValue: activatedRouteMock }, // Provide mocked ActivatedRoute
        FormBuilder // Provide FormBuilder if used directly
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});