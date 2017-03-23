import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Sign } from '../sign.model';
import { HelpersService } from '../../shared/helpers/helpers.service';

@Component({
  moduleId: module.id,
  selector: 'sign',
  templateUrl: 'sign.component.html',
  styleUrls:  ['sign.component.css']
})

export class SignComponent {
  @Input()  forNewSign: boolean = false;  // default to existing sign
  @Input()  sign: Sign;
  @Output() saveEE    = new EventEmitter<any>();
  @Output() destroyEE = new EventEmitter<any>();

  constructor( private helpers: HelpersService ) {}

  getFormType(signType: string): string {
    switch (signType) {
      case 'custom':   return 'custom';
      case 'generic':  return 'generic';
      // If not made explicitly for another type, assume oauth type
      default: {
        console.log('Defaulting to oauth sign');
        return 'oauth';
      }
    }
  }

  destroy(event: any) {
    console.log("SIGNCOMPONENT DESTROY EVENT IS EMITTING EVENT TO ADD-SIGN: ", event);
    // COULD MAKE CONDITIONAL ON NEW SIGN, BUT THEN AGAIN MAY NEED TO UPDATE SIGNS
    // DO WE REALLY NEED THE FULL OBJECT IF CAN CLOSE NEWSIGN STUFF BASE ON LOGIC IN HERE???
    this.destroyEE.emit(event);
  }

  save(event: any): void {
    // Sign preview
    if(event && event.preview === true) {
      this.sign = event.sign;
      return;
    }
    // Sign creation
    else {
      console.log("SIGN AT THE SIGN_COMPONENT LEVEL IS: ", event);
      this.saveEE.emit(event);    // keep passing the sign up
    }
  }
}
