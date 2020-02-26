import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ApiOauthService } from '../core/api/api-oauth.service';
import { Subscription, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Component({
  moduleId: module.id,
  selector: 'confirmation-status-page',
  templateUrl: 'confirmation-status-page.component.html',
  styleUrls: ['confirmation-status-page.component.css']
})
export class ConfirmationStatusPageComponent implements OnInit {
  confirmationData: any = {};
  confirmationSub: Subscription;
  confirmationEmit: Subject<any[]> = new Subject<any[]>();

  constructor(
    private apiOauthService: ApiOauthService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    const that = this;
    this.confirmationSub = this.confirmationEmit.subscribe( confirmationData => {
      this.confirmationData = confirmationData;
    });

    const confirmationCode = this.activatedRoute.snapshot.paramMap.get('confirmationCode');
    this.apiOauthService
        .getDataDeletionStatus(confirmationCode)
        .subscribe(
          data => {
            console.log('Confirmation data: ', data);
            that.confirmationEmit.next(data);
          },
          error => {
            console.log('Error getting confirmation data', error);
          });
  }
}

