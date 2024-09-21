import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-agent',
  templateUrl: './edit-agent.component.html',
  styleUrl: './edit-agent.component.scss'
})
export class EditAgentComponent {
  successMessage: string = '';
  errorMessage: string = '';

  constructor(public http: HttpService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getByID(this.id);
  }

  id: any;
  getByID(id: any) {
    this.http.getAgentById(id).subscribe((result: any) => {
      this.agentForm.setValue(result);
    })
  }
  agentForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    type: new FormControl(''),
    name: new FormControl(''),
    agentId: new FormControl(''),
    cellNumber: new FormControl(''),
    joiningDate: new FormControl(''),
    bankAcNumber: new FormControl(''),
    nagadAcNumber: new FormControl(''),
    bkashAcNumber: new FormControl(''),
    password: new FormControl(''),
    email: new FormControl(''),
    fatherName: new FormControl(''),
    motherName: new FormControl(''),
    dob: new FormControl(''),
    sex: new FormControl(''),
    bloodGroup: new FormControl(''),
    presentAddress: new FormControl(''),
    permanentAddress: new FormControl(''),
    homeDistrict: new FormControl(''),
    emergencyContactNumber: new FormControl(''),
    emergencyContactPerson: new FormControl(''),
    religion: new FormControl(''),
    maritalStatus: new FormControl(''),
    highestEducation: new FormControl(''),
    institute: new FormControl(''),
    previousCompany: new FormControl(''),
    photo: new FormControl(''),
    status: new FormControl(''),
    createAt: new FormControl('')
  })

  

  onSubmit() {
    this.http.updateAgent(this.agentForm.value).subscribe(
      response => {
    
        this.successMessage = "Update successful!";
        this.errorMessage = '';
        this.agentForm.reset();
      },
      error => {
        console.error('Upload failed!', error);
        
        this.successMessage = '';
        this.errorMessage = 'Update failed!';
      }
    );
  }
}


