import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { WishifiedsApi } from '../api/wishifieds-api.service';
import { Message } from '../../messages/message.model';
import { map, catchError } from 'rxjs/operators';


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
               .pipe(
                 map( res => {
                   console.log("SUCCESS CREATE MESSAGE: ", res);
                   return res.json().message as Message;
                 }),
                 catchError( (error: Response) => {
                   console.log("ERROR CREATING MESSAGE: ", error);
                   return Observable.throw(error);
                 })
               );
  }

  // Gets ALL messages for requesting user
  getUserMessages(): Observable<any> {
    const getUserMessagesUrl = this.wishifiedsApi.routes.getUserMessages;
    const options = this.wishifiedsApi.getRequestOptionWithEatHeader();

    return this.http
               .get(getUserMessagesUrl, options)
               .pipe(
                 map( res => {
                   console.log("SUCCESS GET Messages: ", res);
                   return res.json();  // Array of basic listing info with array of messages attached
                 }),
                 catchError( (error: Response) => {
                   return Observable.throw(error);
                 })
               );
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
               .pipe(
                 map( res => {
                   console.log("SUCCESS GET Messages: ", res);
                   return res.json();  // {listingMessages: Message[], unreadCounts: Object[Int, Int]}
                 }),
                 catchError( (error: Response) => {
                   return Observable.throw(error);
                 })
               );
  }

  // listingId may be String or Int
  getListingMessagesCorrespondants(listingId: any): Observable<any> {
    const getListingMessagesUrl =
      this.wishifiedsApi.buildUrl('getListingMessagesCorrespondants', [ { ':id': listingId } ] );
    const options = this.wishifiedsApi.getRequestOptionWithEatHeader();

    return this.http
               .get(getListingMessagesUrl, options)
               .pipe(
                 map( res => {
                   console.log("SUCCESS GET Messages: ", res);
                   return res.json();  // {correspondants: String[], unreadCounts: Object[Int, Int]}
                 }),
                 catchError( (error: Response) => {
                   return Observable.throw(error);
                 })
               );
  }

  getUnreadUserListingsMessages(): Observable<any> {
    const getUnreadUserListingMessagesUrl = this.wishifiedsApi.routes.getUnreadUserListingsMessages;
    const options = this.wishifiedsApi.getRequestOptionWithEatHeader();

    return this.http
               .get(getUnreadUserListingMessagesUrl, options)
               .pipe(
                 map( res => {
                   console.log("SUGGESS GET UNREAD USER LISTING MSGS: ", res);
                   return res.json();
                 }),
                 catchError( (error: Response ) => {
                   return Observable.throw(error);
                 })
               );
  }

  getUserTotalUnreadMessages(): Observable<any> {
    const getUserTotalUnreadMessagesUrl = this.wishifiedsApi.routes.getUserTotalUnreadMessages;
    const options = this.wishifiedsApi.getRequestOptionWithEatHeader();

    return this.http
               .get(getUserTotalUnreadMessagesUrl, options)
               .pipe(
                 map( res => {
                   console.log("SUGGESS GET TOTAL UNREAD USER MSGS: ", res);
                   return res.json();
                 }),
                 catchError( (error: Response ) => {
                   return Observable.throw(error);
                 })
               );
  }

  // Only a recipient can have unread messages. Set them Read after viewing
  updateUnreadMessagesToRead(messageIds: String[]) {
    const updateMessagesToReadUrl = this.wishifiedsApi.routes.updateUnreadMessagesToRead;
    const options = this.wishifiedsApi.getRequestOptionWithEatHeader();

    return this.http
               .patch(updateMessagesToReadUrl, JSON.stringify({messageIds: messageIds}), options)
               .pipe(
                 map( res => {
                   console.log("SUCCESS update messages to Read: ", res);
                   return res.json();  // { success: true/false }
                 }),
                 catchError( (error: Response) => {
                   return Observable.throw(error);
                 })
               );
  }
}
