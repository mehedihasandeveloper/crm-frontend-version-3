import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-qc-edit',
  templateUrl: './qc-edit.component.html',
  styleUrl: './qc-edit.component.scss'
})
export class QcEditComponent implements OnInit {
  onSubmit() {
    console.log(this.qcForm.value);
  }
  id: any;
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

}
