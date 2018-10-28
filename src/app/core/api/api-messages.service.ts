import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { WishifiedsApi } from '../api/wishifieds-api.service';
import { Message } from '../../messages/message.model';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class ApiMessagesService {
  constructor(private http:          Http,
              private wishifiedsApi: WishifiedsApi) {}


  createMessage(messageData: Message) {
    const createMessageUrl = this.wishifiedsApi.routes.createMessage;
    const options = this.wishifiedsApi.getRequestOptionWithEatHeader();
    console.log("OPTIONS ARE: ", options);

    return this.http
               .post(createMessageUrl, JSON.stringify({message: messageData}), options)
               .map( res => {
                 console.log("SUCCESS CREATE MESSAGE: ", res);
                 return res.json().message as Message;
               })
               .catch( (error: Response) => {
                 console.log("ERROR CREATING MESSAGE: ", error);
                 return Observable.throw(error);
               });
  }

  // listingId may be String or Int
  getListingMessages(listingId: any,  correspondantId: any): Observable<any> {
    const getListingMessagesUrl = this.wishifiedsApi.buildUrl('getListingMessages',
      [ { ':id': listingId }, { ':correspondantId': correspondantId } ]
    );
    const options = this.wishifiedsApi.getRequestOptionWithEatHeader();
    console.log("CORRESPONDANT_ID IS: ", correspondantId);
    return this.http
               .get(getListingMessagesUrl, options)
               .map( res => {
                 console.log("SUCCESS GET Messages: ", res);
                 return res.json().listingMessages;  // Example returm: listingMessages: [ { order: 0, hasUnread: true, messages: [ [Object] ] } ]
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
               });
  }

  // listingId may be String or Int
  getListingMessagesCorrespondants(listingId: any): Observable<Message[]> {
    const getListingMessagesUrl =
      this.wishifiedsApi.buildUrl('getListingMessagesCorrespondants', [ { ':id': listingId } ] );
    const options = this.wishifiedsApi.getRequestOptionWithEatHeader();

    return this.http
               .get(getListingMessagesUrl, options)
               .map( res => {
                 console.log("SUCCESS GET Messages: ", res);
                 return res.json().correspondants as string[];
               })
               .catch( (error: Response) => {
                 return Observable.throw(error);
               });
  }
}
