import { Directive, OnChanges, SimpleChanges, Input} from '@angular/core';
import { Validator, Validators, AbstractControl, ValidatorFn, NG_VALIDATORS } from '@angular/forms';
import { ApiUsersService } from '../../core/api/api-users.service';

@Directive({
  selector: '[unique]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: UniqueValidatorDirective, multi: true}
  ]
})

export class UniqueValidatorDirective implements Validator, OnChanges {
  @Input() unique: string;    // Get the value off of unique attribute
  isUnique: boolean;
  private valFn = Validators.nullValidator;

  constructor(private apiUsersService: ApiUsersService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['unique'];  // look for a change to something registered with unique

    if(change) {
      const type: string = change.currentValue; // gives the value set to unique="someval" in the html

      this.valFn = this.uniquenessValidator(type, this.checkApi);
    }
    else {
      this.valFn = Validators.nullValidator;
    }
  }

  validate(control: AbstractControl): {[key: string]: any} {
    return this.valFn(control);
  }

  uniquenessValidator(type: string, callback: Function): ValidatorFn {
    return(control: AbstractControl): {[key: string]: any} => {
      const checkUniqueVal = control.value;
      const isUnique = this.checkApi(type, checkUniqueVal);  // HERE WE NEED TO HIT THE API TO VERIFY UNIQUENESS; DO BASED ON TYPE PASSED IN
      return isUnique ? null : {unique: {checkUniqueVal}};   // Unique, then stand down, else pass error object
      // Not possible to return a value from a callback, soooooo......
    };
  }

  checkApi(type: string, checkVal: string): boolean {
    // Check the API doing something like this:
    // CANT GET THIS TO WORK BECAUSE CANT RETURN VALUE FOR ABOVE FUNCTION......

    // let username = (type === 'username' ? checkVal : '');
    // let email    = (type === 'email'    ? checkVal : '');
    // return this.apiUsersService.checkAvailableValues(username, email)
    //   .subscribe(
    //     success => {
    //       console.log("AVAILABILITY SUCCESS IS: ", success);
    //       return success[type] as boolean;
    //     },
    //     error => {
    //       console.log("AVAILABILITY ERROR IS: ", error);
    //       return false;
    //     });
    return true;
  }
}
