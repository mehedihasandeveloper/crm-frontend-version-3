import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignComponent } from './campaign.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from '../../services/http.service';
import { ReactiveFormsModule } from '@angular/forms';


describe('CampaignComponent', () => {
  let component: CampaignComponent;
  let fixture: ComponentFixture<CampaignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, // Import HttpClientModule
        ReactiveFormsModule // Import ReactiveFormsModule
      ],
      declarations: [CampaignComponent],
      providers: [HttpService] // Provide the HttpService if needed
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
