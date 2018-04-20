import { Component, Input } from '@angular/core';
import { IconService } from '../../core/services/icon.service';
import { MatTooltipModule } from '@angular/material';
import { HoverColorDirective } from '../hover-color/hover-color.directive';


@Component({
  moduleId: module.id,
  selector: 'icon-link',
  templateUrl: 'icon-links.component.html',
  styleUrls:  ['icon-links.component.css']
})

export class IconLinkComponent {
  @Input() url:      string;
  @Input() icon:     string;
  @Input() bgColor:  string;
  @Input() iconSize: string;

  constructor( private icons: IconService ) {}

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }
}
