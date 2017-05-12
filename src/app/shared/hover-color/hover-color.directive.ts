import { Directive, ElementRef, HostListener, Input } from '@angular/core';

// ElementRef enables you to get the referenced element
// Hostlistener adds event listeners to the host, binding to a JS event


@Directive({
  selector: '[hoverColor]'
})

export class HoverColorDirective {
  @Input('hoverColor') hoverColor: string;
  defaultColor = 'white';

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.changeColor(this.hoverColor);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.changeColor(this.defaultColor);
  }

  private changeColor(color: string) {
    this.el.nativeElement.style.color = color;
  }
}
