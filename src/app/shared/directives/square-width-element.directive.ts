import { Directive, ElementRef, AfterViewInit, Input, HostListener } from '@angular/core';

// This Directive will match height to width for the elements of the class name you provide
// So, if you have a set of div's with classes of "my-class",
//    it will match the height to the width for each of those class elements found.
// Example: directive in a div: <div squareWidthElement="my-sub-div">
@Directive({
  selector: '[squareWidthElement]'
})

export class SquareWidthElementDirective implements AfterViewInit {
  @Input('squareWidthElement') targetClass: string;

  constructor(private elRef: ElementRef) {}

  ngAfterViewInit() {
    console.log("NATIVE ELEMENT IS: ", this.elRef.nativeElement);
    console.log("TARGET CLASS IS: ", this.targetClass);
    this.adjustHeightToWidth(this.elRef.nativeElement, this.targetClass);
  }

  @HostListener('window:resize')
  onResize() {
    this.adjustHeightToWidth(this.elRef.nativeElement, this.targetClass);
  }

  adjustHeightToWidth(parent: HTMLElement, className: string) {
    console.log("PARENT IS: ", parent);

    if(!parent) { return; }
    const childNodes = parent.getElementsByClassName(className);
    console.log("CHILDREN IS: ", childNodes);

    // Nothing found, Done.
    if(childNodes && childNodes.length > 1) {
      const children = Array.from(childNodes);
      const width = children[0].getBoundingClientRect().width || 0;
      const widthCss = width + 'px'
      console.log("UPDATE ALL HEIGHTS TO: ", widthCss);
      // Update alll of the heights to match the width

      children.forEach((child: HTMLElement) => {
        console.log("current child is: ", child);
        console.log("child HEIGHT BEFORE IS: ", child.style.height);
        child.style.height = widthCss;
        console.log("child HEIGHT IS NOW: ", child.style.height);
      });
    }
  }
}


// let cards = this.elRef.nativeElement.querySelectorAll('.card-container');
