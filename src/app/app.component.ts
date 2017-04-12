import { Component } from '@angular/core';

@Component({
  selector: 'syynpost-main',
  template: `
    <notifications></notifications>
    <signpost-navbar></signpost-navbar>

    <router-outlet></router-outlet>

    <signpost-footer></signpost-footer>
  `,
})
export class AppComponent  {}
