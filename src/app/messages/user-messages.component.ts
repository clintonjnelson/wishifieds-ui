import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgForm, FormControl, FormsModule }   from '@angular/forms';   // TODO: Remove if no validation logic
import { IconService }         from '../core/services/icon.service';
import { ApiMessagesService }   from '../core/api/api-messages.service';
import { HelpersService }      from '../shared/helpers/helpers.service';
import { Listing }             from '../listings/listing.model';
import { Message }             from './message.model';
import {MatCheckboxModule} from '@angular/material/checkbox';

// ORDER APPEARS TO BE RANDOM, BUT SHOULD DISPLAY BASED ON DATE-TIMESTANP
const MESSAGES: Message[] = [
  {senderId: 1, recipientId: 2, listingId: 3, content: "Im interested in selling you a thing.", createdAt: '2017-10-05T12:48:00.000Z'},
  {senderId: 2, recipientId: 1, listingId: 3, content: "I do still have it & can meet you tomorow.", createdAt: '2017-10-05T13:48:00.000Z'},
  {senderId: 2, recipientId: 1, listingId: 3, content: "Lets' meet at newcastle starbucks.", createdAt: '2017-10-05T15:48:00.000Z'},
  {senderId: 1, recipientId: 2, listingId: 3, content: "Great, let's do a nearby starbucks.", createdAt: '2017-10-05T14:48:00.000Z'}
];


@Component({
  moduleId: module.id,
  selector: 'user-messages',
  templateUrl: 'user-messages.component.html',
  styleUrls: ['user-messages.component.css']
})

// TODO: ADD AUTH FOR MESSAGES LOGIC & CREATION LOGIC/authorization
export class UserMessagesComponent implements OnInit {
  @Input() listingId: number;
  @Input() listingOwnerId: number;
  @Input() sellerId: number;
  currentViewerId: 2;  // WHO is viewing - get from auth. Enables logic to tell how to display stuff.
  messages: Message[];


  // TODO: MAYBE BREAK OUT THE FORM PORTION OF MESSAGE TO SEPARATE COMPONENT
  messageForm: NgForm;
  @ViewChild('messageForm') currentForm: NgForm;
  tempMessage: Message;
  notifyImmediately: Boolean;

  constructor( private icons: IconService,
               private helpers: HelpersService,
               private messagesApi: ApiMessagesService) {
  }

  ngOnInit() {
     // Should call the API to get the messages information for this viewer
     this.messages = MESSAGES;
     this.tempMessage = {
       senderId: 2, // USE AUTH TO FILL THIS VALUE!!!
       recipientId: 2,
       listingId: 3,
       content: '',
       createdAt: '';
     };
     this.notifyImmediately = true;  // TODO: Hook feature up to SMS messaging notification, controlled by user settings as to whether to show or not
  }

  getMessages() {
    this.messagesApi.getListingMessages(this.listingId)
      .subscribe(
        msgs => {
          console.log("MESSAGES FOUND for listing ARE: ", msgs);
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

    const currentViewerId = 1; // TODO: GET REAL VIEWER FROM AUTH
    return (currentViewerId != message.recipientId);
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
          that.messages.push(newMsg);  // TODO: THIS WILL NOT WORK - NEED TO DO SOMETHING LIKE: that.msgsEmit.next(newMsg)
        },
        error => {
          console.log("Error creating message: ", error);
        });
    // !!!!! TODO: MUST SANITIZE THE TEXT BEFORE SAVING!!!!!!!!!!
    // SHOULD TURN THE PREVIEW INTO A NEW BUBBLE AND RESET THE PREVIEW MESSAGE //
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







