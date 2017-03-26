import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SignpostApi } from './signpost-api.service';
import { AuthService } from '../auth/auth.service';
import { Sign } from '../../signs/sign.model';


@Injectable()

export class ApiSignsService {
  constructor(private http:        Http,
              private auth:        AuthService,
              private signpostApi: SignpostApi) {}

  getSignsByUsernameOrId(usernameOrId: string): Observable<Sign[]> {
    let getSignsUrl = this.signpostApi.buildUrl('getSignsByUsernameOrId', [{':usernameOrId': usernameOrId}]);
    return this.http
               .get(getSignsUrl)
               .map( res => {
                 console.log("RESPONSE FROM GET SIGNS BY USER/ID IS: ", res);
                 // RETURN A CUSTOM TYPE HERE IF ALSO NEED THE USERNAME OR REMOVE USERNAME RESPONSE
                 return res.json().signs as Sign[];
               })
               .catch( (error: Response | any) => {
                 console.log("ERROR FROM GET SIGNS BY USER/ID IS: ", error);
                 return error.json();
                 // show error message to user
                 // Maybe use remote logging infrastructure
               });
  }

  createSign(proposedSign: Sign): Observable<Sign> {
    const createSignUrl = this.signpostApi.routes.createSign;
    const options       = this.signpostApi.getRequestOptionWithEatHeader();

    return this.http
               .post(createSignUrl, JSON.stringify({sign: proposedSign}), options)
               .map( res => {
                 console.log("SUCCESS RESPONSE RETURNED FOR SIGN CREATION WITH: ", res);
                 return res.json().sign as Sign;  // hmmmm...
               })
               .catch( error => {
                 console.log("ERROR CREATING SIGN: ", error);
                 return error.json();
               });
  }

  updateSign(proposedSign: Sign): Observable<Sign> {
    const updateSignUrl = this.signpostApi.routes.updateSign;
    const options       = this.signpostApi.getRequestOptionWithEatHeader();

    return this.http
               .patch(updateSignUrl, JSON.stringify({sign: proposedSign}), options)
               .map( res => {
                 console.log("SUCCESS RESPONSE RETURNED FOR SIGN UPDATE: ", res);
                 return res.json().sign as Sign;
               })
               .catch( error => {
                 console.log("ERROR WHEN UPDATING SIGN: ", error);
                 return error.json();
               });
  }

  updateSignOrder(orderedSignIds: string[]): Observable<any> {
    const updateSignOrderUrl = this.signpostApi.routes.updateSignOrder;
    const options            = this.signpostApi.getRequestOptionWithEatHeader();

    console.log("ABOUT TO SEND THIS LIST: ", orderedSignIds);
    return this.http
               .patch(updateSignOrderUrl, JSON.stringify({order: orderedSignIds}), options)
               .map( res => {
                 console.log("SUCCESS ORDERING RESPONSE: ", res);
                 return res.json();  // DONT NEED, SUCCESS IS ENOUGH VERIFICATION
               })
               .catch( err => {
                 console.log("FAILED ORDERING RESPONSE: ", err);
                 return err.json();  // FAILURE INDICATES NOTIFY USER
               });
  }

  destroySign(sign: Sign): Observable<boolean> {
    console.log("IN THE DESTROY_SIGN METHOD...");
    const destroySignUrl = this.signpostApi.routes.destroySign;
    let headers          = this.signpostApi.getHeaderWithEat();
    const options        = new RequestOptions({
                              headers: headers,
                              body:    JSON.stringify({sign: sign})
                           });

    return this.http
               .delete(destroySignUrl, options)
               .map( res => {
                 console.log("SUCCESSFUL DELETION OF SIGN. Response is: ", res);
                 return res.json() as boolean;
               })
               .catch( error => {
                 console.log("ERROR DELETING SIGN. Error is: ", error);
                 return error.json();
               });
  }
}

