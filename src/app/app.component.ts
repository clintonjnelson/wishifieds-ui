import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <notifications></notifications>
    <signpost-navbar></signpost-navbar>

    <router-outlet></router-outlet>

    <signpost-footer></signpost-footer>
  `,
})
export class AppComponent  {}
