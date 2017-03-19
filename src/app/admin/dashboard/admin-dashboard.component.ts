import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ApiAdminService } from '../../core/api/api-admin.service';
import { User } from '../../users/user.model';


@Component({
  moduleId: module.id,
  selector: 'admin-dashboard',
  templateUrl: 'admin-dashboard.component.html',
  styleUrls:  ['admin-dashboard.component.css']
})

export class AdminDashboardComponent implements OnInit {
  isAdmin: boolean;
  users: User[];
  isProcessing: boolean = false;

  constructor(private authService:     AuthService,
              private apiAdminService: ApiAdminService,
              private router:          Router) {}

  ngOnInit() {
    const that = this;
    this.isAdmin = this.authService.isAdmin();

    this.isProcessing = true;
    this.apiAdminService.getUsers()
      .subscribe(
        users => {
          console.log("SUCCESSFUL USER FIND: ", users);
          that.users = users;
          that.isProcessing = false;
        },
        error => {
          // HANDLE THE ERROR MESSAGE HERE;
          console.log("ERROR ADMING GETTING USERS: ", error);
          that.isProcessing = false;
          if(error.status === 401 ) {
            that.router.navigate(['']);
          }
        });
  }
}
