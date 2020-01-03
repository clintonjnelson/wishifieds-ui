// Angular Imports
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components for routing to
import { RequestPasswordResetComponent } from './password-reset/request-password-reset.component';
import { PasswordResetComponent }        from './password-reset/password-reset.component';
import { AdminUserManagementComponent }  from './admin/user-management/admin-user-management.component';
import { HomeComponent }                 from './home/home.component';
import { ListingPageComponent }          from './listings/listing-page.component';
import { EditListingComponent }          from './listings/edit-listing.component';
import { UserPageComponent }             from './users/user-page.component';
import { UserSettingsComponent }         from './users/settings/user-settings.component';
import { OauthRedirectComponent }        from './core/redirects/oauth-redirect.component';
import { UserConfirmationRedirectComponent } from './core/redirects/user-confirmation-redirect.component';
import { TermsConditionsComponent }          from './static-pages/terms-conditions/terms-conditions.component';
import { PrivacyNoticeComponent }            from './static-pages/privacy-notice/privacy-notice.component';
import { FaqComponent }                      from './static-pages/faq/faq.component';
// Guards
import { AdminGuard } from './core/auth/admin-guard.service';
import { OwnerGuard } from './core/auth/owner-guard.service';

// App Routes
const rootRoutes: Routes = [
  { path: 'oauth/errors/:redirecttype',  component: OauthRedirectComponent, pathMatch: 'full'},
  { path: 'oauth/success/:redirecttype', component: OauthRedirectComponent, pathMatch: 'full'},
  { path: 'user/confirmation', component: UserConfirmationRedirectComponent, pathMatch: 'full'},

  { path: 'requestpasswordchange', component: RequestPasswordResetComponent, pathMatch: 'full'},
  { path: 'requestpasswordchange/change', component: PasswordResetComponent, pathMatch: 'full' },

  { path: 'admin/users', component: AdminUserManagementComponent, canActivate: [AdminGuard], pathMatch: 'full' },

  { path: 'search', component: HomeComponent, pathMatch: 'full' },
  { path: 'faq', component: FaqComponent, pathMatch: 'full' },
  { path: 'termsandconditions', component: TermsConditionsComponent, pathMatch: 'full' },
  { path: 'privacynotice', component: PrivacyNoticeComponent, pathMatch: 'full' },

  // These have to come last to avoid username confusion
  { path: ':username/settings',  component: UserSettingsComponent, canActivate: [OwnerGuard], pathMatch: 'full'},
  // TODO: Update this from listingId to SLUG
  // NO: Instead, just make the /listings go to the same component, but use the "listings" part to set the tab
  { path: ':username/listings/:listingId',  component: ListingPageComponent, pathMatch: 'full'},
  { path: ':username/listings',  component: UserPageComponent, pathMatch: 'full'},
  { path: ':username', component: UserPageComponent, pathMatch: 'full' },

  { path: '', component: HomeComponent, pathMatch: 'full' },
  // { path: '**', redirectTo: '/', pathMatch: 'full' },
];


@NgModule({
  imports: [ RouterModule.forRoot(rootRoutes) ],
  exports: [ RouterModule ]
})

export class AppRouterModule {}
