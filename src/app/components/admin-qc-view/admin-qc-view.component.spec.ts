import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQcViewComponent } from './admin-qc-view.component';

describe('AdminQcViewComponent', () => {
  let component: AdminQcViewComponent;
  let fixture: ComponentFixture<AdminQcViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminQcViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminQcViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
