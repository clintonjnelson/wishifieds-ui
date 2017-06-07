import { Component, EventEmitter, Input, Output, OnInit, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
import { NgForm, FormControl }   from '@angular/forms';   // Remove if no validation logic
import { MdTooltipModule }       from '@angular/material';
import { IconService }           from '../../../core/services/icon.service';
import { HelpersService }        from '../../../shared/helpers/helpers.service';
import { AuthService, UserAuth } from '../../../core/auth/auth.service';
import { ApiSignsService }       from '../../../core/api/api-signs.service';
import { ModalService }          from '../../../core/services/modal.service';
import { Subscription }          from 'rxjs/Subscription';
import { Sign }                  from '../../sign.model';
import { ApiInteractionLoggerService } from '../../../core/api/api-interaction-logger.service';


@Component({
  moduleId: module.id,
  selector: 'sign-content',
  templateUrl: 'sign-content.component.html',
  styleUrls:  ['sign-content.component.css']
})

export class SignContentComponent implements OnInit, OnDestroy, AfterViewChecked {
  signForm: NgForm;
  @ViewChild('signForm') currentForm: NgForm;
  @Input()  sign: Sign;
  @Output() saveEE    = new EventEmitter<any>();
  @Output() destroyEE = new EventEmitter<any>();
  tempSign: Sign;
  isOwner = false;
  auth:     UserAuth;
  _subscription: Subscription;

  // For a new sign? If so, tailor the sign form accordingly.
  isEditing        = false;
  forSignCreation  = false;
  showPreviewLabel = false;
  private _forNewSign: void;  // IS THIS REALLY NEEDED????
  @Input('forNewSign') set forNewSign(val: boolean) {
    if(val === true) {
      this.isEditing        = true;
      this.forSignCreation  = true;
      this.showPreviewLabel = true;
    }
  }

  // ************** Auth Methods **************
  constructor( private icons:           IconService,
               private helpers:         HelpersService,
               private authService:     AuthService,
               private apiSignsService: ApiSignsService,
               private modalService:    ModalService,
               private interactions:    ApiInteractionLoggerService) {
    this.auth = authService.auth;
    this._subscription = authService.userAuthEmit.subscribe((newVal: UserAuth) => {
      this.auth = newVal;
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  ngOnInit() {
    this.resetIsOwner();
    this.resetTempSign();
  }

  resetIsOwner() {
    this.isOwner = (this.forSignCreation ? true : this.authService.isOwner(this.sign.userId) );
  }

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }

  urlWithoutPrototol(url: string) {
    console.log("URL WITHOUT PROTOCOL FUNCTION NOW STARTING...");
    return this.helpers.urlWithoutProtocol(url);
  }

  // ************* Form Methods *************
  cancel() {
    this.toggleEditing();
    this.resetTempSign();
  }
  preview() {
    this.toggleEditing();
    this.saveEE.emit({preview: true, sign: this.tempSign});
  }

  destroy() {
    console.log("INSIDE DELETE...");
    const that = this;
    const delSign = this.sign;
    console.log("DEL SIGN IS: ", delSign);
    if(this.forSignCreation) {
      console.log("FOR NEW SIGN CREATION, SO PASSING CLOSE ONLY");
      this.destroyEE.emit({sign: null, destroy: false, close: true});
    }
    else {
      const signDeleteMsg = 'Are you sure you want to delete this '+ delSign.signType +' sign?';
      const showOauthDeleteCheckbox = isOauthSign(delSign.signType);
      const checkboxMsg = 'Also remove ' + delSign.signType + ' login support?';
      // Open modal via service for confirmation
      this.modalService
        .confirm('Sign Deletion', signDeleteMsg, showOauthDeleteCheckbox, checkboxMsg)
        .subscribe((submit) => {
          if(submit.response === true) {
            const delAuthLogin = showOauthDeleteCheckbox ? submit.checkbox : false;
            console.log("ABOUT TO CALL DELETE METHOD SERVICE. RESPONSE WAS: ", submit);
            this.apiSignsService.destroySign(that.sign, delAuthLogin)
              .subscribe(
                success => {
                  console.log("SIGN SUCCESSFULLY DELETED. Success is: ", success);
                  that.destroyEE.emit({sign: delSign, destroy: true, close: true});
                },
                error => {
                  console.log("ERROR DELETING SIGN. Error is: ", error);
                });
          }
        });
    }
    this.toggleEditing(false);  // Close editing window

    function isOauthSign(signType) {
      return ( (signType !== 'custom') && (signType !== 'generic') );
    }
  }

  // HAVE TEMP SIGN SO DONT NEED TO PASS INTO THE METHOD.... BEST PRACTICES HERE?
  save(tempSign: Sign) {
    const that = this;
    // Create New Sign?
    if(this.forSignCreation) {

      if(!tempSign.signName ) {                                 return this.triggerEmptyInputValidations(); }
      if(tempSign.signName === 'custom' && !tempSign.linkUrl) { return this.triggerEmptyInputValidations(); }

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

  logInteraction() {
    console.log("INTERACTION CLICKED");
    const userId = window.localStorage.getItem('userId');
    this.interactions.logSignLinkOffClick(this.sign._id, this.sign.icon, userId);
  }



  // ********** CONSIDER BREAKING OUT TO A SERVICE - SIMILIAR TO SIGNS *************
  // Resets the buttons that are triggered by changes
  private resetFormDisplay() {
    const controls = this.signForm.controls;
    Object.keys(controls).forEach(control => {
      console.log("CONTROL IS: ", control);
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
  };

  ngAfterViewChecked() {
    this.formChangedCheck();
  }

  private triggerEmptyInputValidations() {
    const form = this.signForm.form;
    const inputChecks = ['url', 'title', 'email', 'phone'];
    inputChecks.forEach(function(input) {
      if(form.get(input) !== null) {
        form.get(input).markAsDirty();
      }
    });
    this.onValueChanged(null);
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
