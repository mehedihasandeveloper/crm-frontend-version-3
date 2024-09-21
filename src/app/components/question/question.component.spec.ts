import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionComponent } from './question.component';
import { HttpService } from '../../services/http.service';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

// Mock services
const httpServiceMock = {
  getAllQuestions: () => of([]), // Mock method with an empty observable
  deleteQuestion: (id: any) => of({}), // Mock method with an empty observable
  getQuestionListWithPagination: (offset: number, pageSize: number) => of({
    response: {
      content: [{ /* mock question data */ }],
      totalElements: 1,
      totalPages: 1,
      size: 10
    }
  }) // Mock method with a sample paginated response
};

describe('QuestionComponent', () => {
  let component: QuestionComponent;
  let fixture: ComponentFixture<QuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule // Use RouterTestingModule for routing tests
      ],
      declarations: [QuestionComponent],
      providers: [
        { provide: HttpService, useValue: httpServiceMock }, // Provide mocked HttpService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch question list with pagination', () => {
    component.getQuestionsListWithPagination();
    expect(component.questionList.length).toBeGreaterThan(0);
    expect(component.totalElements).toBe(1);
    expect(component.totalPages).toBe(1);
  });
});
