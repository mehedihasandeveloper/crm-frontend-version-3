import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditQuestionComponent } from './edit-question.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { of } from 'rxjs';

describe('EditQuestionComponent', () => {
  let component: EditQuestionComponent;
  let fixture: ComponentFixture<EditQuestionComponent>;

  beforeEach(async () => {
    // Mock ActivatedRoute
    const activatedRouteStub = {
      snapshot: { params: { id: 'test-id' } }
    };

    // Mock Router
    const routerStub = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    // Mock HttpService
    const httpServiceStub = {
      updateQuestion: jasmine.createSpy('updateQuestion').and.returnValue(of({})),
      getQuestionByID: jasmine.createSpy('getQuestionByID').and.returnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      declarations: [EditQuestionComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: routerStub },
        { provide: HttpService, useValue: httpServiceStub }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});