import { Component, OnInit, Input, ViewChild, OnDestroy} from '@angular/core';
import { NgForm, FormControl, FormsModule }   from '@angular/forms';   // TODO: Remove if no validation logic
import { IconService }         from '../core/services/icon.service';
import { ApiMessagesService }  from '../core/api/api-messages.service';
import { AuthService }         from '../core/auth/auth.service';
import { HelpersService }      from '../shared/helpers/helpers.service';
import { Listing }             from '../listings/listing.model';
import { Message }             from './message.model';
import { MatCheckboxModule }   from '@angular/material/checkbox';
import { Subscription, Subject } from 'rxjs';

// ADD IN THE AUTH SERVICE TO GET THE VIEWER"S ID, so can compare & determine what to show.
// Note, can always show the message response bar, because can always reply to a seller
// Only case is when there are no messages


@Component({
  moduleId: module.id,
  selector: 'user-messages',
  templateUrl: 'user-messages.component.html',
  styleUrls: ['user-messages.component.css']
})

// TODO: In here, messaging is always between a listing owner & a seller/correspondent
// The question is, which one is the sender & which one is the recipient.
// Sender
  // We know that the sender is ALWAYS the auth person, so we can get sender off of there.
// Recipient:
  // If seller is viewing this, we don't need to be passed info, we will use listing owner's as recipient
  // If owner is viewing this, we will need to be passed SELLER"S info, so we also know how to query.



// Component that displays the user's correspondence with another user
// Always between a "viewer" user and another correspondant user (viewer may be owner or cprrespondant).
// Similar layout to normal messenging services with newest at bottom
export class UserMessagesComponent implements OnInit, OnDestroy {
  @Input() listingId: string;
  @Input() listingOwnerId: string;
  @Input() correspondantId: string;  // Needed to track seller correspondant when not avail as auth; optional!
  @Input() messages: Message[] = []; // Allow sending it in, but also allow nothing
  currentViewerId: string;  // WHO is viewing - get from auth. Enables logic to tell how to display stuff.
  iterableDiffer;

  viewerIsOwner: boolean;
  recipientId: string;   // CORRESPONDANT_ID?????
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
     // Messages? Filter as needed. No messages? Call directly
     if(!this.messages || this.messages.length < 1) {
       this.getMessages();
     }
     // Need subscription for catching any updates
     this.msgSub = this.msgsEmit.subscribe((newMsgs: Message[]) => {
       console.log("CHANGING MESSAGES... supposedly. With new messages: ", newMsgs);
       if(newMsgs && newMsgs.length) {
         this.messages = newMsgs;
       }
     });
     this.currentViewerId = this.authService.auth.userId;
     this.setIsOwner();
     this.setRecipient();
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
  }

  ngOnDestroy() {
    this.msgSub.unsubscribe();
  }

  // Note: ONLY called if no messages passed in with @Input (if already have, no need to re-get)
  getMessages() {
    const that = this;

    // This returns ALL messages; sort & filter by user
    this.messagesApi.getListingMessages(this.listingId, this.correspondantId)
      .subscribe(
        res => {
          console.log("RESPONSE FOR GET LISTING MESSAGES IS: ", res);
          var listingMessages = res.listingMessages;
          if(listingMessages && listingMessages.length > 0) {
            let msgs = listingMessages.map(msg => {
              return that.mapMessageModel(msg);
            });
            that.msgsEmit.next(msgs);

            // Set the loaded UNREAD messages to READ
            that.updateUnreadMessagesToRead();
          }
          else {
            console.log("No messages found.");
          }
         },
        error => {
          console.log("Error getting messages for listing: ", error);
        });
  }

  updateUnreadMessagesToRead() {
    const that = this;
    // Get array of all unread message ids present
    // NOTE: ONLY set READ the messages displayed, in case one has come in that's not displayed
    console.log("MESSAGES IS: ", this.messages);
    const messageIds = this.messages.reduce(function(unreads, current) {
      if(current.status === 'UNREAD' &&
        that.helpers.isEqualStrInt(current.recipientId, that.currentViewerId)) {
        console.log("THIS MESSAGE IS: ", current);
        unreads.push(current.id);  // include only if UNREAD
      }
      console.log("UNREADS IS NOW: ", unreads);
      return unreads;
    }, []);

    if(messageIds && messageIds.length) {
      this.messagesApi.updateUnreadMessagesToRead(messageIds)
        .subscribe(
          res => {
            console.log("Success updating messages from unread to read.");
            // TODO? Do nothing after set to read, since no need to change UI now
          },
          error => {
            console.log("Error updating messages from unread to read.");
          });
    }
  }

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }

  isViewerSentMessage(message: Message) {
    return this.helpers.isEqualStrInt(this.currentViewerId, message.senderId);
  }

  // Is the listing owener ID equal to current viewer ID?
  setIsOwner() {
    this.viewerIsOwner = this.helpers.isEqualStrInt(this.currentViewerId, this.listingOwnerId);
  }

  // Recipient is either owner/viewer OR other correspondant
  setRecipient() {
    this.recipientId = (this.currentViewerId == this.listingOwnerId ? this.correspondantId : this.listingOwnerId);
  }

  // TODO: ADD VALIDATIONS ON THE INPUT MESSAGE TO PREVENT INJECTION ATTACKS
  send() {
    const that = this;
    console.log("SENDING NEW MESSAGE with this payload: ", that.tempMessage);
    this.messagesApi.createMessage(that.tempMessage)
      .subscribe(
        newMsg => {
          console.log("MESSAGE CREATED IS: ", newMsg);
          // Clear input for next message
          this.tempMessage.content = '';

          // Add message to list
          const updatedMsgs = that.messages.concat(newMsg)
          that.msgsEmit.next( updatedMsgs );  // TODO: THIS WILL NOT WORK - NEED TO DO SOMETHING LIKE: that.msgsEmit.next(newMsg)
        },
        error => {
          console.log("Error creating message: ", error);
        });
    // !!!!! TODO: FIXME: MUST SANITIZE THE CONTENT TEXT BEFORE SAVING!!!!!!!!!!
    // SHOULD TURN THE PREVIEW INTO A NEW BUBBLE AND RESET THE PREVIEW MESSAGE //
  }


  // TODO: CAN WE MOVE THIS TO THE MESSAGE CLASS ITSELF?????
  private mapMessageModel(rawMsg) {
    return {
      id: rawMsg.id,
      senderId: rawMsg.senderId,
      recipientId: rawMsg.recipientId,
      listingId: rawMsg.listingId,
      content: rawMsg.content,
      status: rawMsg.status,
      createdAt: rawMsg.createdAt
    }
  }
}







