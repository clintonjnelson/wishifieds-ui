import { Component, OnInit } from '@angular/core';
import { HelpersService } from '../shared/helpers/helpers.service';
import { ApiMessagesService } from '../core/api/api-messages.service';

@Component({
  moduleId: module.id,
  selector: 'messages-by-listing',
  templateUrl: 'messages-by-listing.component.html',
  styleUrls: ['messages-by-listing.component.css']
})

export class MessagesByListingComponent implements OnInit {
  listingMessages = []; // Array of complex objects

  constructor(private helpers: HelpersService,
              private messagesApi: ApiMessagesService) {}

  ngOnInit() {

    // TODO: NEED TO ALSO GET THE READ MESSAGES & APPEND THOSE TO DISPLAY LIST.
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
