import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteLeadsComponent } from './delete-leads.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpService } from '../../services/http.service';

describe('DeleteLeadsComponent', () => {
  let component: DeleteLeadsComponent;
  let fixture: ComponentFixture<DeleteLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Include HttpClientTestingModule for HttpClient
        ReactiveFormsModule, // Include ReactiveFormsModule for reactive forms
        RouterTestingModule // Include RouterTestingModule if routing-related directives are used
      ],
      declarations: [DeleteLeadsComponent],
      providers: [HttpService] // Provide HttpService
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add more tests as needed
});
