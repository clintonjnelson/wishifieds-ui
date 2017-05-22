import { Component } from '@angular/core';
import { GuestService } from './core/services/guest.service';

@Component({
  selector: 'syynpost-main',
  template: `
    <notifications></notifications>
    <signpost-navbar></signpost-navbar>

    <router-outlet></router-outlet>

    <signpost-footer></signpost-footer>
  `,
})
export class AppComponent  {
  constructor(private guestService: GuestService) {
    // Ensure guid is set on each visitor for generic metrics info
    if(!window.localStorage.getItem('guid')) { guestService.createAndSetGuid(); }
  }
}
