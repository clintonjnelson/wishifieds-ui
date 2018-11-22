import { Component, OnInit } from '@angular/core';
import { HelpersService } from '../shared/helpers/helpers.service';
import { ApiMessagesService } from '../core/api/api-messages.service';

@Component({
  moduleId: module.id,
  selector: 'unread-messages-by-listing',
  templateUrl: 'unread-messages-by-listing.component.html',
  styleUrls: ['unread-messages-by-listing.component.css']
})

export class UnreadMessagesByListingComponent implements OnInit {
  listingMessages = []; // Array of complex objects

  constructor(private helpers: HelpersService,
              private messagesApi: ApiMessagesService) {}

  ngOnInit() {
    this.messagesApi
      .getUnreadUserListingsMessages()
      .subscribe(
        res => {
          console.log("LISTING MESSAGES RETURNED IS: ", res.messages);
          this.listingMessages = res.messages;
        },
        error => {
          console.log('ERROR GETTING LISTING MESSAGES: ', error);
        }
      );
  }

  displayTime(timestampString: string): string {
    return this.helpers.userDisplayTimeAgo(timestampString);
  }
}
