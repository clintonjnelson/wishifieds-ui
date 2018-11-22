import { Injectable } from '@angular/core';

const CUSTOM_ICONS = {
  ebay:    'ebay',
  disqus:  'disqus',
  imgur:   'imgur',
  patreon: 'ptreon',
};

const SIZE_MAP = {
  1: 'xs',
  2: 'sm',
  3: 'lg',
  4: '2x',
  5: '3x',
  6: '4x',
  7: '5x',
  8: '6x',
  9: '7x',
  10: '8x',
  11: '9x',
  12: '10x'
}


@Injectable()

export class IconService {
  customIcons = CUSTOM_ICONS;

  // Build FontAwesome Class styling syntax from icon name
  buildIconClass(iconName: string, size: string = '2', type: string = 's'): string {
    if(this.customIcons[iconName]) {
      return (`icon-${iconName} custom-icon-size-${size}x`);
    }
    if(!type || type === 's') {
      // TODO: SWITCH THIS COMMENTED CODE WHEN READY TO GO TO v5+
      return (`fa fa-${iconName} fa-${size}x`);
      // return (`fas fa-${iconName} fa-${SIZE_MAP[size]}`);
    }
    // MAKE THIS THE ELSE
    if(type === 'b') {
      return (`fab fa-${iconName} fa-${SIZE_MAP[size]}`);
    }
    else {
      return (`fas fa-${iconName} fa-${SIZE_MAP[size]}`);
    }
  }
}
