import { Component, Input } from '@angular/core';
import { IconService } from '../../core/services/icon.service';
import { MatTooltipModule } from '@angular/material';



@Component({
  moduleId: module.id,
  selector: 'badge',
  templateUrl: 'badge.component.html',
  styleUrls:  ['badge.component.css']
})

export class BadgeComponent {
  @Input() linkUrl: string;
  @Input() badgeType: string;
  @Input() size: string;

  constructor( private icons: IconService ) {}
}
