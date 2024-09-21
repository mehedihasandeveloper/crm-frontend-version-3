import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QcPanelComponent } from './qc-panel.component';

describe('QcPanelComponent', () => {
  let component: QcPanelComponent;
  let fixture: ComponentFixture<QcPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QcPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QcPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
