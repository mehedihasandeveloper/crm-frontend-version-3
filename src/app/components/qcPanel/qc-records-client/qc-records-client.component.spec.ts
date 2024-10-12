import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QcRecordsClientComponent } from './qc-records-client.component';

describe('QcRecordsClientComponent', () => {
  let component: QcRecordsClientComponent;
  let fixture: ComponentFixture<QcRecordsClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QcRecordsClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QcRecordsClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
