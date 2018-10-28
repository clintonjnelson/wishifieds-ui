import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgForm, FormControl, FormsModule }   from '@angular/forms';   // TODO: Remove if no validation logic
import { IconService }         from '../core/services/icon.service';
import { ApiMessagesService }  from '../core/api/api-messages.service';
import { AuthService }         from '../core/auth/auth.service';
import { HelpersService }      from '../shared/helpers/helpers.service';
import { Listing }             from '../listings/listing.model';
import { Message }             from './message.model';
import { MatCheckboxModule }   from '@angular/material/checkbox';
import { Subscription }        from 'rxjs/Subscription';
import { Subject }             from 'rxjs/Subject';

// ADD IN THE AUTH SERVICE TO GET THE VIEWER"S ID, so can compare & determine what to show.
// Note, can always show the message response bar, because can always reply to a seller
// Only case is when there are no messages


@Component({
  moduleId: module.id,
  selector: 'user-messages',
  templateUrl: 'user-messages.component.html',
  styleUrls: ['user-messages.component.css']
})

// TODO: In here, messaging is always between a listing owner & a seller
// The question is, which one is the sender & which one is the recipient.
// Sender
  // We know that the sender is ALWAYS the auth person, so we can get sender off of there.
// Recipient:
  // If seller is viewing this, we don't need to be passed info, we will use listing owner's as recipient
  // If owner is viewing this, we will need to be passed SELLER"S info, so we also know how to query.

export class UserMessagesComponent implements OnInit {
  @Input() listingId: string;
  @Input() listingOwnerId: string;
  @Input() correspondantId: string;  // Needed to track seller correspondant when not avail as auth
  currentViewerId: string;  // WHO is viewing - get from auth. Enables logic to tell how to display stuff.

  viewerIsOwner: boolean;
  recipientId: string;   // CORRESPONDANT_ID?????
  messages: Message[];
  msgSubscription: Subscription;
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
     this.getMessages();
     this.currentViewerId = this.authService.auth.userId;
     this.setIsOwner();
     this.setRecipient();
     this.tempMessage = {
       senderId: this.currentViewerId,  // Whoever will be sending the message out
       recipientId: this.recipientId,  // TODO: THIS IS A LITTLE MORE COMPLICATED - BASED ON WHO CORRESPONDENCE IS WITH
       listingId: this.listingId,  // COULD get this from the route for user messages
       content: '',
       status: '',
       createdAt: ''
     };
     this.notifyImmediately = true;  // TODO: Hook feature up to SMS messaging notification, controlled by user settings as to whether to show or not

     this.messages = [];
     this.msgSubscription = this.msgsEmit.subscribe((newMsgs: Message[]) => {
       console.log("CHANGING MESSAGES... supposedly. With new messages: ", newMsgs);
       if(newMsgs && newMsgs.length) {
         this.messages = this.messages.concat(newMsgs);
       }
     });
  }

  getMessages() {
    const that = this;

    // This returns ALL messages; sort & filter by user
    this.messagesApi.getListingMessages(this.listingId, this.correspondantId)
      .subscribe(
        res => {
          console.log("RESPONSE FOR GET LISTING MESSAGES IS: ", res);
          if(res && res.length > 0) {
            let msgs = res.map(msg => {
              return that.mapMessage(msg);
            });
            console.log("MSGS TO EMIT IS: ")
            that.msgsEmit.next(msgs);
          }
          else {
            console.log("No messages found.");
          }
         },
        error => {
          console.log("Error getting messages for listing: ", error);
        });
  }

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }

  isViewerSentMessage(message: Message) {
    // Sender == CurrentViewer? Display CurrentViewer's messages on LEFT
    // Sender != CurrentViewer? Display Other Person's message on RIGHT
    console.log("MESSAGE BEFORE SETTING isViewerSentMessage is: ", message);
    return (this.currentViewerId === message.senderId);
  }

  setIsOwner() {
    this.viewerIsOwner = this.helpers.isEqualStrInt(this.currentViewerId, this.listingOwnerId);
  }

  setRecipient() {
    this.recipientId = (this.currentViewerId == this.listingOwnerId ? this.correspondantId : this.listingOwnerId);
  }

  // TODO: ADD VALIDATIONS ON THE INPUT MESSAGE TO PREVENT INJECTION ATTACKS

  // TODO: HOOK UP SEND ABILITY FOR CREATING NEW MESSAGES
  send() {
    const that = this;
    console.log("SENDING NEW MESSAGE with this payload: ", that.tempMessage);
    this.messagesApi.createMessage(that.tempMessage)
      .subscribe(
        newMsg => {
          console.log("MESSAGE CREATED IS: ", newMsg);
          that.msgsEmit.next( [newMsg] );  // TODO: THIS WILL NOT WORK - NEED TO DO SOMETHING LIKE: that.msgsEmit.next(newMsg)
        },
        error => {
          console.log("Error creating message: ", error);
        });
    // !!!!! TODO: FIXME: MUST SANITIZE THE CONTENT TEXT BEFORE SAVING!!!!!!!!!!
    // SHOULD TURN THE PREVIEW INTO A NEW BUBBLE AND RESET THE PREVIEW MESSAGE //
  }


  // TODO: CAN WE MOVE THIS TO THE MESSAGE CLASS ITSELF?????
  mapMessage(rawMsg) {
    return {
      senderId: rawMsg.senderId,
      recipientId: rawMsg.recipientId,
      listingId: rawMsg.listingId,
      content: rawMsg.content,
      status: rawMsg.status,
      createdAt: rawMsg.createdAt
    }
  }

  // Logged OUT Helpers
  // toggleInfoContainerExpand(input: any = null): void {
  //   // Trigger GA tracking
  //   // this.gaClick('loginsignupexpand');

  //   console.log("TOGGLING TO: ", !this.expandedInfo);

  //   // If setting value directly, do that.
  //   if(typeof(input) === 'boolean') {
  //     this.expandedInfo = input;
  //   }
  //   // Else, just toggle the value
  //   else {
  //     this.expandedInfo = !this.expandedInfo;
  //   }
  // }
}







