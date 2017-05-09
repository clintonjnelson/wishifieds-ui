import { Injectable } from '@angular/core';

const CUSTOM_ICONS = {
  ebay:    'ebay',
  disqus:  'disqus',
  imgur:   'imgur',
  patreon: 'ptreon',
};


@Injectable()

export class IconService {
  customIcons = CUSTOM_ICONS;

  // Build FontAwesome Class styling syntax from icon name
  buildIconClass(iconName: string, size: string = '2'): string {
    if(this.customIcons[iconName]) {
      return (`icon-${iconName} custom-icon-size-${size}x`);
    }
    else {
      return (`fa fa-${iconName} fa-${size}x`);
    }
  }
}
