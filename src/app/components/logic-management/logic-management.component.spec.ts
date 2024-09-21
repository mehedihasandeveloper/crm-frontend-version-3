import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogicManagementComponent } from './logic-management.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { of } from 'rxjs';

describe('LogicManagementComponent', () => {
  let component: LogicManagementComponent;
  let fixture: ComponentFixture<LogicManagementComponent>;

  beforeEach(async () => {
    // Mock ActivatedRoute
    const activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: (key: string) => key === 'campaignName' ? 'defaultCampaignName' : null
        }
      }
    };

    // Mock HttpService
    const httpServiceStub = {
      getToSetLogicQuestions: jasmine.createSpy('getToSetLogicQuestions').and.returnValue(of([])),
      deleteLogic: jasmine.createSpy('deleteLogic').and.returnValue(of({})),
      isLogicExists: jasmine.createSpy('isLogicExists').and.returnValue(of(false))
    };

    await TestBed.configureTestingModule({
      declarations: [LogicManagementComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: HttpService, useValue: httpServiceStub },
        { provide: Router, useValue: {} } // Provide a mock or empty object for Router if not used in the test
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogicManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
