import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({ selector: '[delayDragLift]' })

export class DragulaDelayLiftDirective {
  dragDelay: number = 700;
  draggable: boolean = false;
  touchTimeout: any;

  constructor(private el: ElementRef) {}

  // @HostListener('mousemove', ['$event'])
  @HostListener('touchmove', ['$event'])
  onMove(e: Event) {
    if (!this.draggable) {
      e.stopPropagation();
      clearTimeout(this.touchTimeout);
    }
  }

  // @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onDown(e: Event) {
    this.touchTimeout = setTimeout(() => {
      this.draggable = true;
    }, this.dragDelay);
  }

  // @HostListener('mouseup', ['$event'])
  @HostListener('touchend', ['$event'])
  onUp(e: Event) {
    clearTimeout(this.touchTimeout);
    this.draggable = false;
  }
}
