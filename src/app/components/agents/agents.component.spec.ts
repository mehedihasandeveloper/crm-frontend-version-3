import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentsComponent } from './agents.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CsvService } from '../../services/csv.service';
import { HttpService } from '../../services/http.service';

describe('AgentsComponent', () => {
  let component: AgentsComponent;
  let fixture: ComponentFixture<AgentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Include HttpClientTestingModule for HttpClient
        ReactiveFormsModule, // Include ReactiveFormsModule if you use reactive forms
        RouterTestingModule // Include RouterTestingModule if you have routing-related directives
      ],
      declarations: [AgentsComponent],
      providers: [HttpService, CsvService] // Provide HttpService and CsvService
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add more tests as needed
});