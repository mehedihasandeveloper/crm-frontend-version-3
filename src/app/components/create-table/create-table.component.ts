import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-create-table',
  templateUrl: './create-table.component.html',
  styleUrls: ['./create-table.component.scss']
})
export class CreateTableComponent implements OnInit {
  successMessage: string = '';
  errorMessage: string = '';
  validationMessage: string = '';
  constructor(private fb: FormBuilder, public http: HttpService, private route: Router, private storageService: StorageService) { }

  campaignList: any[] = [];
  dataTablesForm!: FormGroup;
  columnsForm!: FormGroup;
  isGoClicked: boolean = false;
  isLoggedIn = false;

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.isLoggedIn) {
      this.dataTablesForm = this.fb.group({
        campaignName: ['', Validators.required],
        numberOfField: ['', [Validators.required, Validators.min(1)]]
      });

      this.columnsForm = this.fb.group({
        columns: this.fb.array([])
      });

      this.getAll();
    } else {
      this.route.navigateByUrl('/login')
    }
  }

  get columnsFormArray() {
    return this.columnsForm.get('columns') as FormArray;
  }

  getAll() {
    this.http.getAll().subscribe((result: any) => {
      this.campaignList = result;
    });
  }

  onGenerateAndSubmit() {
    if (this.dataTablesForm.valid) {
      const formData = this.dataTablesForm.value;
      const numberOfFields = formData.numberOfField;
      this.generateFields(numberOfFields);

      // Disable form controls and change button state
      this.dataTablesForm.controls['campaignName'].disable();
      this.dataTablesForm.controls['numberOfField'].disable();
      this.isGoClicked = true;
    } else {
      console.error('Form is invalid');
    }
  }

  generateFields(numberOfFields: number) {
    this.columnsFormArray.clear();
    for (let i = 0; i < numberOfFields; i++) {
      this.columnsFormArray.push(this.fb.control('', Validators.required));
    }
  }

  onReset() {
    // Reset the form controls and clear the column fields
    this.dataTablesForm.reset();
    this.columnsFormArray.clear();

    // Enable form controls and change button state
    this.dataTablesForm.controls['campaignName'].enable();
    this.dataTablesForm.controls['numberOfField'].enable();
    this.isGoClicked = false;
  }

  onSave() {
    // List of predefined column names
    const predefinedColumns = [
      'id', 'did', 'data_status', 'br_id', 'region', 'territory', 'area',
      'respondent_name', 'cell_number', 'data_date', 'brand', 'target_selector',
      'for_d', 'generate_status', 'is_called', 'createdAt'
    ];
  
    // Check if the form is invalid
    if (this.dataTablesForm.invalid || this.columnsForm.invalid) {
      console.error('Form is invalid');
      this.validationMessage = 'Form is invalid';
      return;
    }
  
    const tableName = this.dataTablesForm.get('campaignName')?.value;
    const columns = this.columnsFormArray.value;
  
    // Check if any column name exists in the predefined list
    const duplicateColumn = columns.find((column: string) => predefinedColumns.includes(column.trim()));
  
    if (duplicateColumn) {
      alert(`Column name "${duplicateColumn}" already exists!`);
      this.validationMessage = `Column name "${duplicateColumn}" already exists!`;
      return; // Stop form submission
    }
  
    const formData = {
      tableName: tableName,
      columns: columns
    };
  
    console.log('Form Data before submission:', formData);
  
    // Trigger the HTTP POST request here
    this.http.addDataTable(this.dataTablesForm.value).subscribe(
      (result: any) => {
        console.log('Submission result:', result);
  
        this.http.addDynamicTable(formData).subscribe(
          (result: any) => {
            console.log('Table creation result:', result);
            alert('Table creation successful!');
            this.successMessage = 'Table creation successful!';
            this.route.navigateByUrl('/dataTables');
  
            // Handle successful table creation
          },
          (error: any) => {
            console.error('Table creation error:', error);
            alert('Table creation failed!');
            this.errorMessage = 'Table creation failed!';
          }
        );
      },
      (error: any) => {
        console.error('Submission error:', error);
      }
    );
  }
  
}

