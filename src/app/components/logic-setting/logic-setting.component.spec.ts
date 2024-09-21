import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogicSettingComponent } from './logic-setting.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpService } from '../../services/http.service';
import { of } from 'rxjs';

// Mock services
const httpServiceMock = {
  getAll: () => of([]), // Mock method with an empty observable
  getNumberOfData: (campaignDataTable: string) => of(0) // Mock method with an observable returning 0
};

describe('LogicSettingComponent', () => {
  let component: LogicSettingComponent;
  let fixture: ComponentFixture<LogicSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, // Import HttpClientModule
        RouterTestingModule // Use RouterTestingModule for routing tests
      ],
      declarations: [LogicSettingComponent],
      providers: [
        { provide: HttpService, useValue: httpServiceMock } // Provide mocked HttpService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogicSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});