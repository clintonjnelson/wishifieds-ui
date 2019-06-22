import {EventEmitter} from '@angular/core';
import { AbstractControl, ValidationErrors }  from '@angular/forms';

export function hasImages(control: AbstractControl): ValidationErrors | null {
  const images = control.value;
  // console.log("IN HAS-IMAGES. CONTROL IS: ", control);
  // console.log("IN HAS-IMAGES. CONTROL VALUE IS: ", control.value);

  // FIXME: THIS GETS HIT A L-O-T, AND RUNA THROUGH M-A-N-Y ELEMENTS EACH TIME
  if(images && images.length && images.some(function(elem){ return elem.checked; })) {
    //console.log("RETURNING NO ERROR FOR HAS-IMAGES VALIDATOR");
    // control.touched = true;
    return null;
  }
  else {
    // const changes = control.valueChanges as EventEmitter;
    // changes.hasError = true;
    // control.touched = true;
    //console.log("CONTROL AFTER hasError SET IS: ", control);
    //console.log("RETURNING ERROR FOR HAS-IMAGES VALIDATOR");
    return {hasImages: true}; // hasImages has an error!
  }
}
