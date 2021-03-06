import { Component, Input, OnInit, OnDestroy } from '@angular/core';
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
This is the logic for a single listing's card on the messages display
For a given listing with a bunch of messages, display messages by user
Allow the user avatar to be clicked by the owner to display that user's messages
*/
export class ListingAvatarMessagesComponent implements OnInit, OnDestroy {
  @Input() listingWithMessages: any; // Partial listing info with messages on it
  uniqueSenderIds: any[];  // Filtered from the list of listing messages
  selectedUserId: null;
  selectedMessages: [];
  currentViewerId;  // From auth
  viewerIsOwner: Boolean;
  selectedSub: Subscription;
  selectedEmit: Subject<any> = new Subject<any>();
  profilePicsById = {};

  constructor(
    private helpers: HelpersService,
    private authService: AuthService) {}

  ngOnInit() {
    const that = this;
    this.currentViewerId = this.authService.auth.userId;
    this.viewerIsOwner = (this.currentViewerId == this.listingWithMessages.listingOwnerId);

    // Set unique senders for populating avatars for this listing
    this.setUniqueSendersForMsgs(this.viewerIsOwner);

    // Selected Icon Watcher/Control
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
  }

  ngOnDestroy() {
    this.selectedSub.unsubscribe();
  }

  setUniqueSendersForMsgs(isOwner) {
    const that = this;
    // Unique senders to populate the Icons; filter viewer's own msgs from being a "sender"
    this.uniqueSenderIds = Array.from(
      new Set(
        this.listingWithMessages.messages
          .map(function(msg) { return msg.senderId; })
          .filter(function(senderId) {
            return senderId != that.listingWithMessages.listingOwnerId;
          })
      )
    );
    // console.log("UNIQUE SENDERS IS: ", this.uniqueSenderIds);
  }

  // Activating selected
  showSelectedMessages(userIndex) {
    this.selectedEmit.next(this.uniqueSenderIds[userIndex]);
  }

  // Memoize the value to avoid LOTS unnecessary processing
  getCorrespondantProfilePic(userId) {
    if(this.profilePicsById[userId]) {
      return this.profilePicsById[userId];
    }
    else {
      console.log("USER ID FOR COUNTS IS: ", userId);
      console.log("ListingWithMessages is", this.listingWithMessages);
      if(userId == this.listingWithMessages.listingOwnerId) {
        console.log("USE AUTH PIC URL: ", this.authService.auth.profilePicUrl);
        return this.authService.auth.profilePicUrl;
      }

      var firstSenderMsg = this.listingWithMessages.messages.find(msg => {return msg.senderId == userId})
      console.log("FIRST SENDER MESSAGE PROFILE PIC FOUND: ", firstSenderMsg);
      this.profilePicsById[userId] = firstSenderMsg['senderPicUrl'] || '/assets/profile_default.png';
      return this.profilePicsById[userId];
    }
  }

  countUnreadsByUser(userId) {
    return this.listingWithMessages.messages
      .filter( msg => { return (msg.senderId == userId && msg.status == "UNREAD") })
      .length;
  }

  // Counting unreads for
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
