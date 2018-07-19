import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiAdminService } from '../../core/api/api-admin.service'
import { AuthService } from '../../core/auth/auth.service';

@Component({
  moduleId: module.id,
  selector: 'admin-user-management',
  templateUrl: 'admin-user-management.component.html',
  styleUrls:  ['admin-user-management.component.css']
})

export class AdminUserManagementComponent implements OnInit {
  constructor(protected authService:     AuthService,
              private   apiAdminService: ApiAdminService) {
  }

  isAdmin: boolean;

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
  }

  updateSitemap() {
    this.apiAdminService.updateSitemap()
        .subscribe(
          success => {
            console.log("Success of sitemap update is: ", success);
          },
          error => {
            console.log("Error in sitemap update is: ", error);
          });
  }

  userCleanup() {
    // this.apiAdminService.userCleanup()
    //     .subscribe(
    //       success => {
    //         console.log("Success of user cleanup task is: ", success);
    //       },
    //       error => {
    //         console.log("Error in user cleanup task is: ", error);
    //       });
  }
}
