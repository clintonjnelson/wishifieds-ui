import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SearchBoxComponent } from '../../search/search-box/search-box.component';

@Component({
  moduleId: module.id,
  selector: 'admin-user-management',
  templateUrl: 'admin-user-management.component.html',
  styleUrls:  ['admin-user-management.component.css', '../../search/search-box/search-box.component.css']
})

export class AdminUserManagementComponent extends SearchBoxComponent {
  // foundUsers & foundSigns is in the SearchBoxComponent
  isAdmin: boolean;

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
  }
}
