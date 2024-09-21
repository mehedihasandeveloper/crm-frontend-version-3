import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTablesComponent } from './data-tables.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from '../../services/http.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule

describe('DataTablesComponent', () => {
  let component: DataTablesComponent;
  let fixture: ComponentFixture<DataTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule, // Use RouterTestingModule for routing tests
        ReactiveFormsModule // Add ReactiveFormsModule
      ],
      declarations: [DataTablesComponent],
      providers: [HttpService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
