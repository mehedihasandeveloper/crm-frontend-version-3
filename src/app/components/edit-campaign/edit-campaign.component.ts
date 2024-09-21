import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Campaign } from '../../../model/Campaign';

@Component({
  selector: 'app-edit-campaign',
  templateUrl: './edit-campaign.component.html',
  styleUrl: './edit-campaign.component.scss'
})
export class EditCampaignComponent implements OnInit{
  successMessage: string = '';
  errorMessage: string = '';
  constructor(public http: HttpService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getByID(this.id);
  }

  id!: any;
  campaign!: Campaign;

  campaignForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    campaignName: new FormControl(''),
    campaignId: new FormControl(''),
    callTarget: new FormControl(),
    status: new FormControl(),
    createAt: new FormControl(''),
    
  })
onCancel(){
  this.router.navigateByUrl('/campaign');

}
  onSubmit() {
    this.http.updateData(this.campaignForm.value).subscribe(
      response => {
    
        this.successMessage = "Update successful!";
        this.errorMessage = '';
        this.campaignForm.reset();
      },
      error => {
        console.error('Upload failed!', error);
        
        this.successMessage = '';
        this.errorMessage = 'Update failed!';
      }
    );
  }

  getByID(id: any) {
    this.http.getByID(id).subscribe((result: any) => {
      this.campaign = result;
      console.log(this.campaign.id);
      
      console.log(this.campaign);
      this.campaignForm.setValue(result);
    });
  }

}
