import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsComponent } from './reports.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { CsvService } from '../../services/csv.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

// describe('ReportsComponent', () => {
//   let component: ReportsComponent;
//   let fixture: ComponentFixture<ReportsComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [ReportsComponent]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(ReportsComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

// Mock services
const httpServiceMock = {
  getAll: () => of([]), // Mock the method with an empty observable
  getUniqueJoiningDates: (campaignName: string) => of([]) // Mock method
};

const csvServiceMock = {
  downloadExcelFor_d: (campaignName: string, date: string) => {}, // Mock method
  downloadExcelFullReport: (campaignName: string, startDate: string, endDate: string) => {} // Mock method
};

const routerMock = {
  navigateByUrl: jasmine.createSpy('navigateByUrl')
};

describe('ReportsComponent', () => {
  let component: ReportsComponent;
  let fixture: ComponentFixture<ReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, // Import HttpClientModule
        ReactiveFormsModule // Import ReactiveFormsModule
      ],
      declarations: [ReportsComponent],
      providers: [
        { provide: HttpService, useValue: httpServiceMock }, // Provide mocked HttpService
        { provide: CsvService, useValue: csvServiceMock }, // Provide mocked CsvService
        { provide: Router, useValue: routerMock } // Provide mocked Router
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});