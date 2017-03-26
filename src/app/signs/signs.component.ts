import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { AuthService } from '../core/auth/auth.service';
import { ApiSignsService } from '../core/api/api-signs.service';
import { Sign } from './sign.model';


@Component({
  moduleId:       module.id,
  selector:       'signs-list',
  templateUrl:    'signs.component.html',
  styleUrls:     ['signs.component.css'],
  viewProviders: [DragulaService],
})

export class SignsComponent {
  @Input() signs: Sign[];
  @Output() saveEE    = new EventEmitter<any>()
  @Output() destroyEE = new EventEmitter<any>();
  isOwner: boolean;

  constructor(private dragulaService:  DragulaService,
              private authService:     AuthService,
              private route:           ActivatedRoute,
              private apiSignsService: ApiSignsService) {

    let signOwnerUsername = route.snapshot.params['username'];
    this.isOwner = authService.isOwner(signOwnerUsername);

    dragulaService.drop.subscribe((val: any) => {
      let orderedSignIds = this.signs.map( sign => { return sign._id; } );
      console.log("ABOUT TO HIT API TO CHANGE ORDER...");

      this.apiSignsService.updateSignOrder(orderedSignIds)
        .subscribe(
          signs => {
            console.log("MADE IT BACK WITH ORDERING SUCCESS");
          },
          error => {
            console.log("MADE IT BACK WITH ORDERING FAILURE");
          });
    });
  }

  destroy(event: any) {
    console.log("SIGNS COMPONENT DESTROY EVENT IS EMITTING EVENT TO USER-PAGE: ", event);
    this.destroyEE.emit(event);
  }

  save(event: any): void {
    console.log("SIGN AT THE SIGNS COMPONENT LEVEL IS: ", event);
    this.saveEE.emit(event);    // keep passing the sign up
  }
}
