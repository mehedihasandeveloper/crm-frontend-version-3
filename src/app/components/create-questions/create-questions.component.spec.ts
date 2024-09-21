import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuestionsComponent } from './create-questions.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';

describe('CreateQuestionsComponent', () => {
  let component: CreateQuestionsComponent;
  let fixture: ComponentFixture<CreateQuestionsComponent>;
  let httpService: HttpService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, // Import HttpClientModule
        ReactiveFormsModule // Import ReactiveFormsModule
      ],
      declarations: [CreateQuestionsComponent],
      providers: [
        HttpService,
        { provide: Router, useValue: { navigateByUrl: () => {} } } // Mock Router
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateQuestionsComponent);
    component = fixture.componentInstance;
    httpService = TestBed.inject(HttpService); // Inject HttpService
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
