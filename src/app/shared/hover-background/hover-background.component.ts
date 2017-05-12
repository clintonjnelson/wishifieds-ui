import { Directive, ElementRef, HostListener, Input } from '@angular/core';

// ElementRef enables you to get the referenced element
// Hostlistener adds event listeners to the host, binding to a JS event


@Directive({
  selector: '[hoverBkgd]'
})

export class HoverBackgroundDirective {
  constructor(private el: ElementRef) {
  }

  @Input('hoverBkgd') hoverBkgd: string;
  defaultColor = 'none';

  @HostListener('mouseenter') onMouseEnter() {
    this.changeColor(this.hoverBkgd);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.changeColor(this.defaultColor);
  }

  private changeColor(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
