import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCampaignComponent } from './edit-campaign.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpService } from '../../services/http.service';

describe('EditCampaignComponent', () => {
  let component: EditCampaignComponent;
  let fixture: ComponentFixture<EditCampaignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditCampaignComponent],
      imports: [
        HttpClientTestingModule, // Include HttpClientTestingModule
        RouterTestingModule, // Include RouterTestingModule
        ReactiveFormsModule // Include ReactiveFormsModule for forms
      ],
      providers: [
        HttpService // Provide the HttpService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});