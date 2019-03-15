import { Component, Input, OnInit } from '@angular/core';
import { HelpersService } from '../shared/helpers/helpers.service';
import { Message } from './message.model';
import { MatBadgeModule } from '@angular/material';
import { AuthService } from '../core/auth/auth.service';
import { Subscription, Subject } from 'rxjs';

@Component({
  moduleId: module.id,
  selector: 'listing-avatar-messages',
  templateUrl: 'listing-avatar-messages.component.html',
  styleUrls: ['listing-avatar-messages.component.css']
})

/*
For a given listing with a bunch of messages, display messages by user
Allow the user avatar to be clicked by the owner to display that user's messages
*/
export class ListingAvatarMessagesComponent implements OnInit {
  @Input() listingWithMessages: any; // Partial listing info with messages on it
  uniqueSenderIds: any[];  // Filtered from the list of listing messages
  selectedUserId: null;
  selectedMessages: [];
  currentViewerId;  // From auth
  selectedSub: Subscription;
  selectedEmit: Subject<any> = new Subject<any>();

  constructor(
    private helpers: HelpersService,
    private authService: AuthService) {}

  ngOnInit() {
    const that = this;
    console.log("IN LISTING AVATAR MESSAGES CONTAINER. INPUT IS: ", this.listingWithMessages);
    this.uniqueSenderIds = Array.from(
      new Set(
        this.listingWithMessages.messages.map(function(msg) {return msg.senderId;})
      )
    );
    console.log("UNIQUE SENDERS IS: ", this.uniqueSenderIds);

    this.selectedSub = this.selectedEmit.subscribe((newSelected: any) => {
      console.log("CHANGING User to: ", newSelected);
      if(newSelected == this.selectedUserId) {
        this.selectedUserId = null;
        this.selectedMessages = [];
      } else {
        this.selectedMessages = this.filterBySelected(newSelected);
        this.selectedUserId = newSelected;
      }
    });

    this.currentViewerId = this.authService.auth.userId;
  }

  showSelectedMessages(userIndex) {
    this.selectedEmit.next(this.uniqueSenderIds[userIndex]);
  }

  countUnreads(messages: Message[]) {
    const that = this;
    return messages.reduce(
      function(total, currMsg){
        const isUnread = (currMsg.status == 'UNREAD' && currMsg.senderId != that.currentViewerId);
        return ( isUnread ? total+1 : total);
      }, 0);
  }

  private filterBySelected(selectedId) {
    return this.listingWithMessages.messages.filter( msg => {
      return (msg.senderId == selectedId || msg.recipientId == selectedId);
    });
  }
}
