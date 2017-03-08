import { Directive, OnChanges, SimpleChanges, Input} from '@angular/core';
import { Validator, Validators, AbstractControl, ValidatorFn, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[unique]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: UniqueValidatorDirective, multi: true}
  ]
})

export class UniqueValidatorDirective implements Validator, OnChanges {
  @Input() unique: string;    // Get the value off of unique attribute
  private valFn = Validators.nullValidator;

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['unique'];  // look for a change to something registered with unique

    if(change) {
      const type: string = change.currentValue; // gives the value set to unique="someval" in the html
      this.valFn = this.uniquenessValidator(type);
    }
    else {
      this.valFn = Validators.nullValidator;
    }
  }

  validate(control: AbstractControl): {[key: string]: any} {
    return this.valFn(control);
  }

  uniquenessValidator(type: string): ValidatorFn {
    return(control: AbstractControl): {[key: string]: any} => {
      const checkUniqueVal = control.value;
      const isUnique = this.checkApi(type, checkUniqueVal);  // HERE WE NEED TO HIT THE API TO VERIFY UNIQUENESS; DO BASED ON TYPE PASSED IN
      return isUnique ? null : {unique: {checkUniqueVal}};   // Unique, then stand down, else pass error object
    }
  }

  checkApi(type: string, checkVal: string): boolean {
    // Check the API doing something like this:
    // html.get(checkTypeRoutes[type] + '?checkVal=${checkval}').success()

    return (false ? true : false);
  }

  checkTypeRoutes = {
    email: 'route/to/myapi/emailcheck',
    username: 'route/to/myapi/emailcheck'
  };
}
