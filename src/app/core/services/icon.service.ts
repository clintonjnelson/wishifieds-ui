import { Injectable } from '@angular/core';

const CUSTOM_ICONS = {
  ebay:    'ebay',
  disqus:  'disqus',
  imgur:   'imgur',
  patreon: 'ptreon',
};

const SIZE_MAP = {
  0: 'xs',
  1: 'sm',
  2: 'lg',
  3: '2x',
  4: '3x',
  5: '4x',
  6: '5x',
  7: '6x',
  8: '7x',
  9: '8x',
  10: '9x',
  11: '10x'
}


@Injectable()

export class IconService {
  customIcons = CUSTOM_ICONS;

  // Build FontAwesome Class styling syntax from icon name
  buildIconClass(iconName: string, size: string = '', type: string = 's'): string {
    if(this.customIcons[iconName]) {
      return (`icon-${iconName} custom-icon-size-${size}x`);
    }
    if(type == 'b') {
      return (`fab fa-${iconName} fa-${SIZE_MAP[size]}`);
    }
    // r is often used for "hollow"/"outline" versions of icons
    if(type == 'r') {
      return (`far fa-${iconName} fa-${SIZE_MAP[size]}`);
    }
    else {
      return (`fas fa-${iconName} fa-${SIZE_MAP[size]}`);
    }
  }
}
