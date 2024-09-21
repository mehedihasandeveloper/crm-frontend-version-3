import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateLeadsComponent } from './generate-leads.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('GenerateLeadsComponent', () => {
  let component: GenerateLeadsComponent;
  let fixture: ComponentFixture<GenerateLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Include HttpClientTestingModule for HttpService
        ReactiveFormsModule, // Include ReactiveFormsModule for form handling
        RouterTestingModule // Include RouterTestingModule to handle routing directives
      ],
      declarations: [GenerateLeadsComponent],
      providers: [HttpService] // Provide HttpService, remove Router from providers
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add more tests as needed
});