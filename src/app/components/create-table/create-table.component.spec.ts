import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTableComponent } from './create-table.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from '../../services/http.service';
import { ReactiveFormsModule } from '@angular/forms';

// describe('CreateTableComponent', () => {
//   let component: CreateTableComponent;
//   let fixture: ComponentFixture<CreateTableComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [CreateTableComponent]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(CreateTableComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
describe('CreateTableComponent', () => {
  let component: CreateTableComponent;
  let fixture: ComponentFixture<CreateTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, // Import HttpClientModule
        ReactiveFormsModule // Import ReactiveFormsModule
      ],
      declarations: [CreateTableComponent],
      providers: [HttpService] // Provide the HttpService if needed
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});