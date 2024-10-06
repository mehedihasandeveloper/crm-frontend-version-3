import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QcRecordsViewComponent } from './qc-records-view.component';

describe('QcRecordsViewComponent', () => {
  let component: QcRecordsViewComponent;
  let fixture: ComponentFixture<QcRecordsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QcRecordsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QcRecordsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
