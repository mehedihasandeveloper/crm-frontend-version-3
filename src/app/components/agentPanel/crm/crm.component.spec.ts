import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRMComponent } from './crm.component';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('CRMComponent', () => {
  let component: CRMComponent;
  let fixture: ComponentFixture<CRMComponent>;

  beforeEach(async () => {
    // Create a mock for ActivatedRoute
    const activatedRouteStub = {
      queryParams: of({ campaignName: 'defaultCampaignName' })
    };

    // Create a mock for HttpService
    const httpServiceStub = {
      getLeadByCellNumber: jasmine.createSpy('getLeadByCellNumber').and.returnValue(of({})),
      getToSetLogicQuestions: jasmine.createSpy('getToSetLogicQuestions').and.returnValue(of([])),
      getAllCampaignLogic: jasmine.createSpy('getAllCampaignLogic').and.returnValue(of([])),
      updateLeadByCellNumber: jasmine.createSpy('updateLeadByCellNumber').and.returnValue(of({}))
    };

    await TestBed.configureTestingModule({
      declarations: [CRMComponent],
      imports: [ReactiveFormsModule],  // Include ReactiveFormsModule here
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: HttpService, useValue: httpServiceStub }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CRMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});