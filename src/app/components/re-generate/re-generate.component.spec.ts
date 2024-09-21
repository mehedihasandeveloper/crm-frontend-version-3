import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReGenerateComponent } from './re-generate.component';
import { HttpService } from '../../services/http.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ReGenerateComponent', () => {
  let component: ReGenerateComponent;
  let fixture: ComponentFixture<ReGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Include HttpClientTestingModule for HttpClient
        ReactiveFormsModule, // Include ReactiveFormsModule for reactive forms
        RouterTestingModule // Include RouterTestingModule if routing-related directives are used
      ],
      declarations: [ReGenerateComponent],
      providers: [HttpService] // Provide HttpService
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add more tests as needed
});