import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiAdminService } from '../../core/api/api-admin.service'
import { SearchBoxComponent } from '../../search/search-box/search-box.component';
import { AuthService } from '../../core/auth/auth.service';
import { SignpostApi } from '../../core/api/signpost-api.service';
import { ApiSearchService } from '../../core/api/api-search.service';
import { GAEventService } from '../../core/services/ga-event.service';

@Component({
  moduleId: module.id,
  selector: 'admin-user-management',
  templateUrl: 'admin-user-management.component.html',
  styleUrls:  ['admin-user-management.component.css', '../../search/search-box/search-box.component.css']
})

export class AdminUserManagementComponent extends SearchBoxComponent implements OnInit {
  // reference SearchBoxComponent TS file for logic that is extended to here
  constructor(private   apiSearchServiceInChild: ApiSearchService,
              private   signpostApiInChild:      SignpostApi,
              protected authServiceInChild:      AuthService,
              private   routeInChild:            ActivatedRoute,
              private   gaEventInChild:          GAEventService,
              private   apiAdminService:         ApiAdminService) {
    super(apiSearchServiceInChild, signpostApiInChild, authServiceInChild, routeInChild, gaEventInChild);
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
}
