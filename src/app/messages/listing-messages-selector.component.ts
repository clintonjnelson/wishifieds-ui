import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { NgForm, FormControl, FormsModule }   from '@angular/forms';   // TODO: Remove if no validation logic
import { IconService }         from '../core/services/icon.service';
import { ApiMessagesService }  from '../core/api/api-messages.service';
import { AuthService }         from '../core/auth/auth.service';
import { HelpersService }      from '../shared/helpers/helpers.service';
import { Listing }             from '../listings/listing.model';
import { Message }             from './message.model';
import { MatCheckboxModule }   from '@angular/material/checkbox';
import { Subscription, Subject }        from 'rxjs';

// ADD IN THE AUTH SERVICE TO GET THE VIEWER"S ID, so can compare & determine what to show.
// Note, can always show the message response bar, because can always reply to a seller
// Only case is when there are no messages


@Component({
  moduleId: module.id,
  selector: 'listing-messages-selector',
  templateUrl: 'listing-messages-selector.component.html',
  styleUrls: ['listing-messages-selector.component.css']
})

// TODO: In here, messaging is always between a listing owner & a seller/correspondent
// The question is, which one is the sender & which one is the recipient.
// Sender
  // We know that the sender is ALWAYS the auth person, so we can get sender off of there.
// Recipient:
  // If seller is viewing this, we don't need to be passed info, we will use listing owner's as recipient
  // If owner is viewing this, we will need to be passed SELLER"S info, so we also know how to query.

export class ListingMessagesSelectorComponent implements OnInit, OnDestroy {
  @Input() listingId: string;
  @Input() listingOwnerId: string;
  @Input() correspondantId: string;  // Needed to track seller correspondant when not avail as auth
  currentViewerId: string;  // WHO is viewing - get from auth. Enables logic to tell how to display stuff.

  viewerIsOwner: boolean;
  recipientId: string;   // CORRESPONDANT_ID?????
  messages: Message[];
  msgSub: Subscription;
  msgsEmit: Subject<Message[]> = new Subject<Message[]>();

  // TODO: MAYBE BREAK OUT THE FORM PORTION OF MESSAGE TO SEPARATE COMPONENT
  messageForm: NgForm;
  @ViewChild('messageForm') currentForm: NgForm;
  tempMessage: Message;
  notifyImmediately: Boolean;

  constructor( private icons: IconService,
               private helpers: HelpersService,
               private messagesApi: ApiMessagesService,
               private authService: AuthService) {
  }

  ngOnInit() {
     // Should call the API to get the messages information for this viewer
     console.log("CORRESPONDANT IN LISTING IS: ", this.correspondantId);
     // this.getMessages();   // FIXME
     this.currentViewerId = this.authService.auth.userId;
     // this.setIsOwner();  // FIXME
     // this.setRecipient();  // FIXME
     this.tempMessage = {
       id: '',
       senderId: this.currentViewerId,  // Whoever will be sending the message out
       recipientId: this.recipientId,
       listingId: this.listingId,  // COULD get this from the route for user messages
       content: '',
       status: '',
       createdAt: ''
     };
     this.notifyImmediately = true;  // TODO: Hook feature up to SMS messaging notification, controlled by user settings as to whether to show or not

     this.messages = [];
     this.msgSub = this.msgsEmit.subscribe((newMsgs: Message[]) => {
       console.log("CHANGING MESSAGES... supposedly. With new messages: ", newMsgs);
       if(newMsgs && newMsgs.length) {
         this.messages = newMsgs;
       }
     });
  }

  ngOnDestroy() {
    this.msgSub.unsubscribe();
  }
}
