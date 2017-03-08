import { Component, Input, OnInit } from '@angular/core';
import { HelpersService } from '../../shared/helpers/helpers.service';
import { User } from '../user.model';

@Component({
  moduleId: module.id,
  selector: 'user-sign',
  templateUrl: 'user-sign.component.html',
  styleUrls:  ['user-sign.component.css']
})

export class UserSignComponent implements OnInit {
  @Input() user: User;
  isAdmin: boolean;

  constructor( private helpers: HelpersService) {}

  ngOnInit() {
    this.isAdmin = this.setIfAdmin();
  }

  // ****************** ADMIN ONLY FUNCTIONALITY ******************
  setIfAdmin() {
    return true ? true : false;
  }

  deactivateUser() {
    console.log("HIT DEACTIVATE");
    // PROBABLY PASS THIS UP A LEVEL AND UPDATE FROM THERE SO CAN MAKE ASYNC & UPDATE DIRECTLY WITH FLOW-DOWN
    // HOWEVER COULD UPDATE HERE FOR FLOW-DOWN APPEARANCE AS WELL...
    this.user.status = 'inactive';
  }
  activateUser() {
    // PROBABLY PASS THIS UP A LEVEL AND UPDATE FROM THERE SO CAN MAKE ASYNC & UPDATE DIRECTLY WITH FLOW-DOWN
    // HOWEVER COULD UPDATE HERE FOR FLOW-DOWN APPEARANCE AS WELL...
    this.user.status = 'active';
  }
}
