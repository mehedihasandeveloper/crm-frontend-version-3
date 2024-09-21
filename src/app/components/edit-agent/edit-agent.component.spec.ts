import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAgentComponent } from './edit-agent.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpService } from '../../services/http.service';

describe('EditAgentComponent', () => {
  let component: EditAgentComponent;
  let fixture: ComponentFixture<EditAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Include HttpClientTestingModule for HttpClient
        ReactiveFormsModule, // Include ReactiveFormsModule for reactive forms
        RouterTestingModule // Include RouterTestingModule if routing-related directives are used
      ],
      declarations: [EditAgentComponent],
      providers: [HttpService] // Provide HttpService
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add more tests as needed
});