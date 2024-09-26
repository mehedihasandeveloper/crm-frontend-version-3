import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InBoundViewComponentComponent } from './in-bound-view-component.component';

describe('InBoundViewComponentComponent', () => {
  let component: InBoundViewComponentComponent;
  let fixture: ComponentFixture<InBoundViewComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InBoundViewComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InBoundViewComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
