// Angular Imports
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components for routing to
import { RequestPasswordResetComponent } from './password-reset/request-password-reset.component';
import { PasswordResetComponent }        from './password-reset/password-reset.component';
import { AdminDashboardComponent }       from './admin/dashboard/admin-dashboard.component';
import { AdminUserManagementComponent }  from './admin/user-management/admin-user-management.component';
import { LivingStyleGuideComponent }     from './styleguide/livingstyleguide.component';
import { SearchBoxComponent }            from './search/search-box/search-box.component';
import { UserPageComponent }             from './users/user-page.component';
import { UserSettingsComponent }         from './users/settings/user-settings.component';

// Guards
import { AdminGuard } from './core/auth/admin-guard.service';
import { OwnerGuard } from './core/auth/owner-guard.service';

// App Routes
const rootRoutes: Routes = [
  { path: 'requestpasswordchange', component: RequestPasswordResetComponent, pathMatch: 'full'},
  { path: 'requestpasswordchange/change', component: PasswordResetComponent, pathMatch: 'full' },

  { path: 'admin/users', component: AdminUserManagementComponent, canActivate: [AdminGuard], pathMatch: 'full' },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard], pathMatch: 'full' },

  { path: 'styleguide', component: LivingStyleGuideComponent, pathMatch: 'full' },

  { path: ':username/settings', component: UserSettingsComponent, canActivate: [OwnerGuard], pathMatch: 'full'},
  { path: ':username', component: UserPageComponent, pathMatch: 'full' },

  { path: '', component: SearchBoxComponent, pathMatch: 'full' },
  // { path: '**', redirectTo: '/', pathMatch: 'full' },
];


@NgModule({
  imports: [ RouterModule.forRoot(rootRoutes) ],
  exports: [ RouterModule ]
})

export class AppRouterModule {}
