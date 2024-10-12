import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QcReportsComponent } from './qc-reports.component';

describe('QcReportsComponent', () => {
  let component: QcReportsComponent;
  let fixture: ComponentFixture<QcReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QcReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QcReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
