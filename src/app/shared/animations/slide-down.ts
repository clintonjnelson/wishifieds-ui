import { trigger, state, style, animate, transition } from '@angular/animations';

export const SlideDownAnimation = [
  [
    trigger('slideDown', [
      transition(':enter', [
        style({ height: 0, overflow: 'hidden' }),
        animate('700ms ease-in-out', style({ height: '*', overflow: 'hidden' }))
      ]),
      transition(':leave', [
        style({ height: '*', overflow: 'hidden' }),
        animate('200ms ease-out', style({ height: 0, overflow: 'hidden' }))
      ])
    ])
  ]
];
