import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFullCRMComponent } from './view-full-crm.component';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { of } from 'rxjs';

describe('ViewFullCRMComponent', () => {
  let component: ViewFullCRMComponent;
  let fixture: ComponentFixture<ViewFullCRMComponent>;

  beforeEach(async () => {
    // Mock ActivatedRoute
    const activatedRouteStub = {
      queryParams: of({ campaignName: 'testCampaignName' }) // Mock the observable for queryParams
    };

    // Mock HttpService
    const httpServiceStub = {
      getToSetLogicQuestions: jasmine.createSpy('getToSetLogicQuestions').and.returnValue(of([]))
    };

    await TestBed.configureTestingModule({
      declarations: [ViewFullCRMComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: HttpService, useValue: httpServiceStub }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFullCRMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});