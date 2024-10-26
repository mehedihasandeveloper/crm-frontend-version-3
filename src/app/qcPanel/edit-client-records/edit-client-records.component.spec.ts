import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClientRecordsComponent } from './edit-client-records.component';

describe('EditClientRecordsComponent', () => {
  let component: EditClientRecordsComponent;
  let fixture: ComponentFixture<EditClientRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditClientRecordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditClientRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
