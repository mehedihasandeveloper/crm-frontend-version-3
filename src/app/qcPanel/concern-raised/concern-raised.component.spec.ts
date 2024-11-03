import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcernRaisedComponent } from './concern-raised.component';

describe('ConcernRaisedComponent', () => {
  let component: ConcernRaisedComponent;
  let fixture: ComponentFixture<ConcernRaisedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConcernRaisedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConcernRaisedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
