import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgForm, FormControl }   from '@angular/forms';   // TODO: Remove if no validation logic
import { IconService }         from '../core/services/icon.service';
import { HelpersService }      from '../shared/helpers/helpers.service';
import { Listing }             from '../listings/listing.model';
import { Message }             from './message.model';

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
  @Input() sellerId: number;  // Person who listed listing
  @Input() buyerId: number;   // Person who is contacting on listing
  // @Input() viewerId: number;  // Person currently viewing these messages - GET FROM AUTH SERVICE!!!!
  viewerId: 2;  // GET FROM AUTH
  messages: Message[];

  // TODO: MAYBE BREAK OUT THE FORM PORTION OF MESSAGE TO SEPARATE COMPONENT
  messageForm: NgForm;
  @ViewChild('messageForm') currentForm: NgForm;
  tempMessage: Message;

  constructor( private icons: IconService,
               private helpers: HelpersService) {
  }

  ngOnInit() {
     // Should call the API to get the messages information for this viewer
     this.messages = MESSAGES;
     this.tempMessage = {
       senderId: 2, // USE AUTH TO FILL THIS VALUE!!!
       recipientId: 2,
       listingId: 3,
       content: '',
       createdAt: 'preview'
     };
  }

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }

  isReceivedMessage(message: Message) {
    const currentViewerId = 1; // TODO: GET REAL VIEWER FROM AUTH
    return (currentViewerId != message.recipientId);
  }

  // TODO: ADD VALIDATIONS ON THE INPUT MESSAGE TO PREVENT INJECTION ATTACKS

  // TODO: HOOK UP SEND ABILITY FOR CREATING NEW MESSAGES
  send() {
    // !!!!! TODO: MUST SANITIZE THE TEXT BEFORE SAVING!!!!!!!!!!
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







