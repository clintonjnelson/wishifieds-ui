import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NotificationService } from '../services/notification.service';

@Injectable()

export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService,
              private router:      Router,
              private notification: NotificationService) {}

  // Apparently the route passes route & state to canActivate
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkAdminLogin(url);
  }

  checkAdminLogin(url: string): boolean {
    // Authorized Admin
    if(this.authService.auth.isLoggedIn && this.authService.isAdmin()) { return true; }

    // Unauthorized
    if(!this.authService.auth.isLoggedIn) {
      this.authService.redirectUrl = url;
      this.notification.notify('warning', 'Please login first.');
    }
    else {
      this.notification.notify('warning', 'You are not authorized for access');
    }

    this.router.navigate(['']);
    return false;
  }
}
