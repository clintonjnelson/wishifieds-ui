import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material';
import { IconService } from '../../core/services/icon.service';
//import { GuestService } from '../../core/services/guest.service';

// GDPR & similar data consent banner
@Component({
  selector: 'data-consent-banner',
  templateUrl: 'data-consent-banner.component.html',
  styleUrls:  ['data-consent-banner.component.css']
})
export class DataConsentBannerComponent {

  constructor( public snackBarRef: MatSnackBarRef<DataConsentBannerComponent>,
               @Inject(MAT_SNACK_BAR_DATA) public data: any,
               private icons: IconService,){
               //private guestService: GuestService) {
  }

  accept() {
    console.log("DATA IN BANNER IS: ", this.data);
    if(this.data && this.data.accept) {
      this.data.accept();  // this.guestService.updateConsentAcceptance();
    }
    this.snackBarRef.dismiss();
  }

  buildIconClass(icon: string, size: string = '2', fontType: string = 's') {
    return this.icons.buildIconClass(icon, size, fontType);
  }
}
