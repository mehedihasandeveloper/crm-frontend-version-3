import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QcEditComponent } from './qc-edit.component';

describe('QcEditComponent', () => {
  let component: QcEditComponent;
  let fixture: ComponentFixture<QcEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QcEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QcEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
