import { Component } from '@angular/core';
import { GuestService } from './core/services/guest.service';

@Component({
  selector: 'site-main',
  template: `
    <notifications></notifications>
    <main-navbar></main-navbar>

    <router-outlet></router-outlet>

    <site-footer></site-footer>
  `,
})


export class AppComponent  {
  constructor(private guestService: GuestService) {
    // Ensure guid is set on each visitor for generic metrics info
    if(!window.localStorage.getItem('guid')) { guestService.createAndSetGuid(); }
  }
}
