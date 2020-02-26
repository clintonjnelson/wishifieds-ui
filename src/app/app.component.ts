import { Component, OnInit } from '@angular/core';
import { GuestService } from './core/services/guest.service';

@Component({
  selector: 'site-main',
  template: `
    <!-- This is used by ALL of the app for notifications -->
    <!-- <notifications></notifications> -->

    <main-navbar></main-navbar>

    <router-outlet></router-outlet>

    <site-footer></site-footer>
  `,
})


export class AppComponent implements OnInit {
  constructor(private guestService: GuestService) {}

  ngOnInit() {
    this.guestService.checkConsent();
    // Ensure guid is set on each visitor for generic metrics info
  }
}
