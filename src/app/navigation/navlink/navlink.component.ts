import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'navlink',
  templateUrl: 'navlink.component.html',
  styleUrls:  ['navlink.component.css'],
})

export class NavLinkComponent {
  @Input() linkPath: string;
  @Input() linkIcon: string;
  @Input() linkName: string;
}
