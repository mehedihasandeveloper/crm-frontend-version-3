import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-client-records',
  templateUrl: './edit-client-records.component.html',
  styleUrl: './edit-client-records.component.scss'
})
export class EditClientRecordsComponent implements OnInit {

  id: any;
  total: number = 0;
  constructor(public http: HttpService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    console.log(this.id);
    this.getById(this.id);

  }

  getById(id: any) {
    this.http.getClientQcReportById(id).subscribe((result: any) => {
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
    greetingsMarks: new FormControl(),
    livelinessMarks: new FormControl(),
    pronunciationMarks: new FormControl(),
    mumblingMarks: new FormControl(),
    paceMarks: new FormControl(),
    pitchMarks: new FormControl(),
    courtesyMarks: new FormControl(),
    holdProcessMarks: new FormControl(),
    takingPermissionMarks: new FormControl(),
    acknowledgementAndFollowUpMarks: new FormControl(),
    poorObjectionAndNegotiationSkillMarks: new FormControl(),
    crmMarks: new FormControl(),
    closingMarks: new FormControl(''),
    fatalMarks: new FormControl(''),
    fatalReasonMarks: new FormControl(''),
    easVoiceMatchedWithReportMarks: new FormControl(''),
    total: new FormControl(''),
    agentGrade: new FormControl(''),
    suggestionMarks: new FormControl(''),
    qcInspector: new FormControl(''),
  })


  calculateTotal() {
    this.qcForm.value.total =
      this.qcForm.value.greetingsMarks + this.qcForm.value.livelinessMarks + this.qcForm.value.pronunciationMarks +
      this.qcForm.value.mumblingMarks + this.qcForm.value.paceMarks + this.qcForm.value.pitchMarks +
      this.qcForm.value.courtesyMarks + this.qcForm.value.holdProcessMarks + this.qcForm.value.takingPermissionMarks +
      this.qcForm.value.acknowledgementAndFollowUpMarks + this.qcForm.value.poorObjectionAndNegotiationSkillMarks +
      this.qcForm.value.crmMarks + this.qcForm.value.closingMarks + this.qcForm.value.fatalMarks;

      this.qcForm.value.agentGrade = this.decideAgentGrade(this.qcForm.value.total);
  }

  onSubmit() {
    this.calculateTotal();
    console.log(this.qcForm.value);
    this.http.updateClientQc(this.qcForm.value).subscribe(
      response => {
        alert("Update Successful!");
        this.router.navigateByUrl('/QcRecordsClient')
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
