import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsComponent } from './leads.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from '../../services/http.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('LeadsComponent', () => {
  let component: LeadsComponent;
  let fixture: ComponentFixture<LeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        ReactiveFormsModule    // Add ReactiveFormsModule here
      ],
      declarations: [LeadsComponent],
      providers: [HttpService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});