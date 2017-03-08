import { Directive, ElementRef, HostListener, Input } from '@angular/core';

// ElementRef enables you to get the referenced element
// Hostlistener adds event listeners to the host, binding to a JS event


@Directive({
  selector: '[hoverColor]'
})

export class HoverColorDirective {
  constructor(private el: ElementRef) {
  }

  @Input('hoverColor') iconColor: string;
  defaultColor: string = 'white';

  @HostListener('mouseenter') onMouseEnter() {
    this.changeColor(this.iconColor);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.changeColor(this.defaultColor)
  }

  private changeColor(color: string) {
    this.el.nativeElement.style.color = color;
  }
}
