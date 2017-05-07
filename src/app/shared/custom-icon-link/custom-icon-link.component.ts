import { Component, Input } from '@angular/core';
import { HelpersService } from '../helpers/helpers.service';
import { MdTooltipModule } from '@angular/material';
import { HoverColorDirective } from '../hover-color/hover-color.directive';


@Component({
  moduleId: module.id,
  selector:    'custom-icon-link',
  templateUrl: 'custom-icon-link.component.html',
  styleUrls:  ['custom-icon-link.component.css']
})

export class CustomIconLinkComponent {
  @Input() url:      string;
  @Input() icon:     string;
  @Input() bgColor:  string;
  @Input() iconSize: string;

  constructor( private helpers: HelpersService ) {}

  buildIconClass(icon: string, size: string = '2') {
    return this.helpers.buildCustomIconClass(icon, size);
  }
}
