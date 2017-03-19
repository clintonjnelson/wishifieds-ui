import { Component, EventEmitter, Input, Output, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm, FormControl }   from '@angular/forms';   // Remove if no validation logic
import { HelpersService }        from '../../../shared/helpers/helpers.service';
import { AuthService, UserAuth } from '../../../core/auth/auth.service';
import { ApiSignsService }       from '../../../core/api/api-signs.service';
import { ModalService }          from '../../../core/services/modal.service';
import { Subscription }          from 'rxjs/Subscription';
import { Sign }                  from '../../sign.model';


@Component({
  moduleId: module.id,
  selector: 'sign-content',
  templateUrl: 'sign-content.component.html',
  styleUrls:  ['sign-content.component.css']
})

export class SignContentComponent implements OnInit {
  signForm: NgForm;
  @ViewChild('signForm') currentForm: NgForm;
  @Input()  sign: Sign;
  @Output() saveEE    = new EventEmitter<any>();
  @Output() destroyEE = new EventEmitter<any>();
  tempSign: Sign;
  isOwner:  boolean = false;
  auth:     UserAuth;
  _subscription: Subscription;

  // For a new sign? If so, tailor the sign form accordingly.
  isEditing:           boolean = false;
  forSignCreation:     boolean = false;
  showPreviewLabel:    boolean = false;
  private _forNewSign: void;  // IS THIS REALLY NEEDED????
  @Input('forNewSign') set forNewSign(val: boolean) {
    if(val === true) {
      this.isEditing        = true;
      this.forSignCreation  = true;
      this.showPreviewLabel = true;
    }
  }

  // ************** Auth Methods **************
  constructor( private helpers:         HelpersService,
               private authService:     AuthService,
               private apiSignsService: ApiSignsService,
               private modalService:    ModalService) {
    this.auth = authService.auth;
    this._subscription = authService.userAuthEmit.subscribe((newVal: UserAuth) => {
      this.auth = newVal;
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  ngOnInit() {
    this.isOwner = this.authService.isOwner(this.sign.userId);
    this.resetTempSign();
  }


  // ************* Form Methods *************
  cancel() {
    this.toggleEditing();
    this.resetTempSign();
  }
  preview() {
    this.toggleEditing();
    this.saveEE.emit({preview: true, sign: this.tempSign})
  }

  destroy() {
    console.log("INSIDE DELETE...");
    var that = this;
    var confirmResponse: boolean;
    var delSign = this.sign;
    if(this.forSignCreation) {
      console.log("FOR NEW SIGN CREATION, SO PASSING CLOSE ONLY");
      this.destroyEE.emit({sign: null, destroy: false, close: true});
    }
    else {
      // Open modal via service for confirmation
      this.modalService
        .confirm('Sign Deletion', 'Are you sure you want to delete this '+ that.sign.signName +' sign?')
        .subscribe((response) => {
          if(response === true) {
            console.log("ABOUT TO CALL DELETE METHOD SERVICE...")
            this.apiSignsService.destroySign(that.sign)
              .subscribe(
                success => {
                  console.log("SIGN SUCCESSFULLY DELETED. Success is: ", success);
                  that.destroyEE.emit({sign: delSign, destroy: true, close: true});
                },
                error => {
                  console.log("ERROR DELETING SIGN. Error is: ", error);
                })
          }
        });
    }
    this.toggleEditing(false);  // Close editing window
  }

  // HAVE TEMP SIGN SO DONT NEED TO PASS INTO THE METHOD.... BEST PRACTICES HERE?
  save(tempSign: Sign) {
    const that = this;
    // Create New Sign?
    if(this.forSignCreation) {
      console.log("CALLING THE CREATE SIGN ROUTE for this sign: ", tempSign);
      this.apiSignsService.createSign(tempSign)
        .subscribe(
          sign => {
            console.log("SUCCESSFUL SIGN CREATION: ", sign);
            that.saveEE.emit(sign);  // pass the new sign up
            that.toggleEditing(false);
            that.resetTempSign();
          },
          error => {
            console.log("GOT AN ERROR CREATING SIGN. ERROR: ", error);
          });
    }
    // Else Update existing sign
    else {
      console.log("CALLING THE UPDATE SIGN ROUTE");
      this.apiSignsService.updateSign(tempSign)
        .subscribe(
          success => {  // returns {error: false}
            console.log("SUCCESSFUL UPDATE. OBJECT IS: ", success);
            // After success, update the sign and then reset the temp sign
            that.sign = Object.assign({}, tempSign);
            that.saveEE.emit(tempSign);  // pass the new sign up
            that.toggleEditing(false);
            that.resetTempSign();
          },
          error => {  // return {error: true, msg: }
            console.log("ERROR DURING UPDATE. ERROR IS: ", error);
            // SHOW SOME ERROR TO USER HERE
          });
    }
  }

  toggleEditing(input: any = null): void {
    if(typeof(input) === 'boolean') { this.isEditing = input; }
    else { this.isEditing = !this.isEditing; }
    console.log("EDITING TOGGLED & IS NOW: ", this.isEditing);
  }

  // ********** CONSIDER BREAKING OUT TO A SERVICE - SIMILIAR TO SIGNS *************
  // Resets the buttons that are triggered by changes
  private resetFormDisplay() {
    var controls = this.signForm.controls;
    Object.keys(controls).forEach(control => {
      controls[control].markAsPristine();
      controls[control].markAsUntouched();
    });
  }

  private resetTempSign() {
    this.tempSign = Object.assign({}, this.sign);  // Make a copy
  }


  // ******************** CUSTOM VALIDATIONS HERE **************************
  // NOTE: validationErrorMessages are implemented in each sign content type
  validationErrorMessages: Object;
  displayedValidationErrors = {
    signName: '',
    title: '',
    linkUrl: '',
    knownAs: '',
    description: '',
    url: '',
    email: '',
    phone: ''
  }

  ngAfterViewChecked() {
    this.formChangedCheck();
  }

  private formChangedCheck() {
    if(this.currentForm === this.signForm) { return; }

    this.signForm = this.currentForm;

    if(this.signForm) {
      this.signForm.valueChanges.subscribe(data => this.onValueChanged(data));
    }
  }

  private onValueChanged(data?: any) {
    if(!this.signForm) { return; }
    const form = this.signForm.form;

    for(const inputName in this.displayedValidationErrors) {
      // clear previous error messages
      this.displayedValidationErrors[inputName] = '';
      const control = form.get(inputName);  // get value from input

      // If control inputName is dirtied & not valid, show all applicable errors
      if(control && control.dirty && !control.valid) {
        const msgs = this.validationErrorMessages[inputName];  // get all messages for each type
        for(const error in control.errors) {
          this.displayedValidationErrors[inputName] += msgs[error] + ' ';
        }
      }
    }
  }
}
