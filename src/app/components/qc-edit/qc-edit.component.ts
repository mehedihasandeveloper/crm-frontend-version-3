import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { response } from 'express';
import { error } from 'console';

@Component({
  selector: 'app-qc-edit',
  templateUrl: './qc-edit.component.html',
  styleUrl: './qc-edit.component.scss'
})
export class QcEditComponent implements OnInit {

  id: any;
  total: number = 0;
  constructor(public http: HttpService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    console.log(this.id);
    this.getById(this.id);

  }

  getById(id: any) {
    this.http.getQcReportById(id).subscribe((result: any) => {
      this.qcForm.setValue(result);
    })
  }

  qcForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    callDate: new FormControl(''),
    agentName: new FormControl(''),
    agentId: new FormControl(''),
    campaignName: new FormControl(''),
    consumerNumber: new FormControl(''),
    duration: new FormControl(''),
    greetings: new FormControl(),
    liveliness: new FormControl(),
    pronunciation: new FormControl(),
    mumbling: new FormControl(),
    pace: new FormControl(),
    pitch: new FormControl(),
    courtesy: new FormControl(),
    holdProcess: new FormControl(),
    takingPermission: new FormControl(),
    acknowledgementAndFollowUp: new FormControl(),
    poorObjectionAndNegotiationSkill: new FormControl(),
    crm: new FormControl(),
    closing: new FormControl(''),
    fatal: new FormControl(''),
    fatalReason: new FormControl(''),
    easVoiceMatchedWithReport: new FormControl(''),
    total: new FormControl(''),
    agentGrade: new FormControl(''),
    suggestion: new FormControl(''),
    qcInspector: new FormControl(''),
  })


  calculateTotal() {
    this.qcForm.value.total =
      this.qcForm.value.greetings + this.qcForm.value.liveliness + this.qcForm.value.pronunciation +
      this.qcForm.value.mumbling + this.qcForm.value.pace + this.qcForm.value.pitch +
      this.qcForm.value.courtesy + this.qcForm.value.holdProcess + this.qcForm.value.takingPermission +
      this.qcForm.value.acknowledgementAndFollowUp + this.qcForm.value.poorObjectionAndNegotiationSkill +
      this.qcForm.value.crm + this.qcForm.value.closing + this.qcForm.value.fatal;

      this.qcForm.value.agentGrade = this.decideAgentGrade(this.qcForm.value.total);
  }

  onSubmit() {
    this.calculateTotal();
    console.log(this.qcForm.value);
    this.http.updateQc(this.qcForm.value).subscribe(
      response => {
        alert("Update Successful!");
        this.router.navigateByUrl('/viewQcReports')
      },
      error => {
        console.log('Update failed', error);
        alert("Update failed")
        
      }
    )
  }

  decideAgentGrade(total: number) {
    if (total >= 90) {
      return 'Exceed Expectation';

    } else if (total >= 80) {
      return 'Meet Expectation';

    } else if (total >= 70) {
      return 'Average Expectation';

    } else {
      return 'Below Expectation';
    }
  }

}
