import { Injectable } from '@angular/core';
import { AlertsService } from './alerts.service';
import { DataConsentBannerComponent } from '../../shared/notifications/data-consent-banner.component';

@Injectable()

export class GuestService {
  constructor(private alertService: AlertsService) {}

  checkConsent() {
    const that = this;
    if( window.localStorage.getItem('consentoken')) {
      this.createAndSetGuid();
    }
    else {
      // Trigger GDPR Consent
      setTimeout(() => {
        const bannerData = {accept: this.updateConsentAcceptance.bind(that)}
        that.alertService.queueComponentAlert(DataConsentBannerComponent, bannerData, {panelClass: 'default-snackbar'});
      });
    }
  }

  updateConsentAcceptance() {
    console.log("Running accept...");
    this.createAndSetConsentoken();
    this.createAndSetGuid();
  }

  createAndSetGuid() {
    console.log("Checking & setting GUID...");
    if(!window.localStorage.getItem('guid')) {
      const guid = window.crypto.getRandomValues(new Uint32Array(3)).toString().replace(/,/g, '-');
      console.log("GUID GENERATED AS: ", guid);

      window.localStorage.setItem('guid', guid);
    }
  }

  createAndSetConsentoken() {
    console.log("Checking & setting CONSENT...");
    if(!window.localStorage.getItem('consentoken')) {
      const consentoken = new Date().toISOString();
      console.log("Consentoken GENERATED AS: ", consentoken);

      window.localStorage.setItem('consentoken', consentoken);
    }
  }
}
