import { Component, OnInit } from '@angular/core';
import { HelpersService } from '../shared/helpers/helpers.service';
import { ApiMessagesService } from '../core/api/api-messages.service';
import { Subscription, Subject } from 'rxjs';

@Component({
  moduleId: module.id,
  selector: 'messages-by-listing',
  templateUrl: 'messages-by-listing.component.html',
  styleUrls: ['messages-by-listing.component.css']
})


/*
This component needs to query all listings that the user has been chatting
Then organize the messages under the appropriate listing.
*/
export class MessagesByListingComponent implements OnInit {
  listingsWithMessages = []; // Array of complex objects
  listingsMsgsSubscription: Subscription;
  listingsMsgsEmit: Subject<any[]> = new Subject<any[]>();

  constructor(private helpers: HelpersService,
              private messagesApi: ApiMessagesService) {}

  ngOnInit() {
    const that = this;
    this.listingsMsgsSubscription = this.listingsMsgsEmit.subscribe((listingsMsgs: any[]) => {
      this.listingsWithMessages = listingsMsgs;
    });

    this.messagesApi
      .getUserMessages()
      .subscribe(
        res => {
          console.log("LISTING MESSAGES RETURNED IS: ", res);
          const listingsMsgs = res.listingsWithMessages;
          if(listingsMsgs && listingsMsgs.length) {
            // Format messages for UI usage
            let lstgMsgs = listingsMsgs.map(listing => {
              listing.messages = listing.messages.map(msg => {
                return that.mapMessageModel(msg);
              });
              return listing;
            });
            this.listingsMsgsEmit.next(lstgMsgs);
          }
        },
        error => {
          console.log('ERROR GETTING LISTING MESSAGES: ', error);
        }
      );
  }

  displayTime(timestampString: string): string {
    return this.helpers.userDisplayTimeAgo(timestampString);
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
