import { Component, EventEmitter, Input, Output, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm, FormControl }   from '@angular/forms';   // Remove if no validation logic
import { HelpersService }        from '../../../shared/helpers/helpers.service';
import { AuthService, UserAuth } from '../../../core/auth/auth.service';
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
  constructor( private helpers:      HelpersService,
               private authService:  AuthService,
               private modalService: ModalService) {
    this.auth = authService.auth;
    this._subscription = authService.userAuthEmit.subscribe((newVal: UserAuth) => {
      this.auth = newVal;
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  ngOnInit() {
    // this.signForm = this.currentForm;
    this.isOwner = this.authService.isOwner(this.sign.username);
    this.resetTempSign();
  }


  // ************* Form Methods *************
  cancel() {
    this.toggleEditing();
    this.resetTempSign();
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
            that.destroyEE.emit({sign: delSign, destroy: true, close: true});
          }
        });
    }
    this.toggleEditing(false);  // Close editing window
  }

  // HAVE TEMP SIGN SO DONT NEED TO PASS INTO THE METHOD.... BEST PRACTICES HERE?
  save(tempSign: Sign) {
    if(this.forSignCreation) {
      console.log("SUBMIT: THIS SHOULD CALL THE CREATE SIGN ROUTE");
    }
    else {
      console.log("SUBMIT: THIS SHOULD CALL THE UPDATE SIGN ROUTE");
      // After success, update the sign and then reset the temp sign
      this.sign = Object.assign({}, tempSign);
      this.resetTempSign();
    }
    // ONLY CLOSE THE ADDSIGN AREA & Toggle Editing UPON SUCCESS!!!!
    this.toggleEditing(false);       // SHOULD ONLY DO UPON SUCCESS!!!!!!!
    this.saveEE.emit(this.sign);      // keep passing the sign up
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
