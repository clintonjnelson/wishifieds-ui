import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../users/user.model';

const USERS: User[] = [
  { username: "Jen",   picUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Official_portrait_of_Barack_Obama.jpg", status: "active" },
  { username: "Clint", picUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/44_Bill_Clinton_3x4.jpg/220px-44_Bill_Clinton_3x4.jpg", status: "active"},
  { username: "Eilee", picUrl: "", status: "active" },
  { username: "Clara", picUrl: "", status: "active" },
];

@Component({
  moduleId: module.id,
  selector: 'admin-dashboard',
  templateUrl: 'admin-dashboard.component.html',
  styleUrls:  ['admin-dashboard.component.css']
})

export class AdminDashboardComponent implements OnInit {
  isAdmin: boolean;
  @Input() users: User[];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isAdmin = this.setIfAdmin();
    this.users = USERS;
  }

  setIfAdmin() {
    return true ? true : false;
  }
}
