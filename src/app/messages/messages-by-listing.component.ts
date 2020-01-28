import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class MessagesByListingComponent implements OnInit, OnDestroy {
  listingsWithMessages = []; // Array of complex objects
  listingsMsgsSub: Subscription;
  listingsMsgsEmit: Subject<any[]> = new Subject<any[]>();

  constructor(private helpers: HelpersService,
              private messagesApi: ApiMessagesService) {}

  ngOnInit() {
    const that = this;
    // !!!!!!!!!!vvvvvvvvvvvvvvvvv!!!!!!!!
    // !!!! Make this sort the messages by total unreads? Sort by oldest unread? Sort by Newest Unread?
    // !!!! We will need the sorting algorithm to be variable to filter choices, so pick the best place
    // Eventually move logic from the server's ordering to the UI's ordering, and
      // choose the most logical base server order (like by date ordering)
    this.listingsMsgsSub = this.listingsMsgsEmit.subscribe((listingsMsgs: any[]) => {
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
              // Replace the messages object list with the UI mapped messages objects list
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

  ngOnDestroy() {
    this.listingsMsgsSub.unsubscribe();
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
      createdAt: rawMsg.createdAt,
      senderPicUrl: rawMsg.senderPicUrl
    }
  }
}
