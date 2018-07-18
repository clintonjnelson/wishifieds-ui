//// This file exists to establish key facts about the ENTIRE app
// Modules
import { NgModule }        from '@angular/core';
import { BrowserModule }   from '@angular/platform-browser';
import { RouterModule }    from '@angular/router';
import { AppRouterModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule }     from '@angular/forms';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { MatDialogModule, MatInputModule, MatTooltipModule, MatFormFieldModule,
  MatSelectModule, MatCheckboxModule, MatTabsModule, MatChipsModule, MatCardModule }  from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragulaModule }    from 'ng2-dragula/ng2-dragula';
import { DragScrollModule } from 'ngx-drag-scroll';
import { NguCarouselModule } from '@ngu/carousel';
import { ChartsModule }     from 'ng2-charts/ng2-charts';
import 'hammerjs';

// Core Components (From Template)
import { AppComponent }                  from './app.component';
import { TermsConditionsComponent }      from './static-pages/terms-conditions/terms-conditions.component';
import { PrivacyNoticeComponent }        from './static-pages/privacy-notice/privacy-notice.component';
import { FaqComponent }                  from './static-pages/faq/faq.component';

import { IconLinkComponent }             from './shared/icon-links/icon-links.component';
import { NavbarComponent }               from './navigation/navbar/navbar.component';
import { FooterComponent }               from './footer/footer.component';

import { AdminUserManagementComponent }  from './admin/user-management/admin-user-management.component';
import { HomeComponent }                 from './home/home.component';

import { LoginSignupFormComponent }      from './users/login-signup-form/login-signup-form.component';
import { UserPageComponent }             from './users/user-page.component';
import { UserSettingsComponent }         from './users/settings/user-settings.component';

import { RequestPasswordResetComponent } from './password-reset/request-password-reset.component';
import { PasswordResetComponent }        from './password-reset/password-reset.component';

import { NotificationsComponent }        from './notifications/notifications.component';
import { ConfirmModalComponent }         from './shared/confirm-modal/confirm-modal.component';

// Custom Components
import { AddListingComponent }           from './listings/add-listing.component';
import { EditListingComponent }          from './listings/edit-listing.component';
import { ListingPageComponent }          from './listings/listing-page.component';
import { ListingFullComponent }          from './listings/listing-full.component';
import { ListingCardComponent }          from './listings/listing-card.component';
import { ListingCardsComponent }         from './listings/listing-cards.component';
import { ListingsSearchInputComponent }  from './listings/search/listings-search-input.component';
import { ListingsSearchComponent }       from './listings/search/listings-search.component';

import { UserMessagesComponent }         from './messages/user-messages.component';
import { MessageBubbleComponent }         from './messages/message-bubble.component';

// Directives
import { HoverColorDirective }           from './shared/hover-color/hover-color.directive';
import { HoverBackgroundDirective }      from './shared/hover-background/hover-background.component';
import { UniqueValidatorDirective }      from './shared/validators/unique.directive';
import { DragulaDelayLiftDirective }     from './shared/dragula-delay-lift/dragula-delay-lift.directive';

// Services - make them available EVERYWHERE (otherwise, just add it specifically into Component as a provider)
import { HttpIntercept }                 from './core/api/http-intercept';
import { AuthService }                   from './core/auth/auth.service';
import { GuestService }                  from './core/services/guest.service';
import { GAEventService }                from './core/services/ga-event.service';
import { NotificationService }           from './core/services/notification.service';
import { ModalService }                  from './core/services/modal.service';
import { SignpostApi }                   from './core/api/signpost-api.service';
import { ApiAuthService }                from './core/api/api-auth.service';
import { ApiAdminService }               from './core/api/api-admin.service';
import { ApiUsersService }               from './core/api/api-users.service';
import { HelpersService }                from './shared/helpers/helpers.service';
import { IconService }                   from './core/services/icon.service';
import { UserConfirmationRedirectComponent } from './core/redirects/user-confirmation-redirect.component';

// Guards
import { AdminGuard } from './core/auth/admin-guard.service';
import { OwnerGuard } from './core/auth/owner-guard.service';

// Pipes
import { CallbackPipe } from './shared/pipes/callback.pipe';

// Providers
export function HttpFactory(backend: XHRBackend,
                            defaultOptions: RequestOptions,
                            authService: AuthService) {
  return new HttpIntercept(backend, defaultOptions, authService);
}

@NgModule({
  imports:      [
                  BrowserModule,
                  AppRouterModule,
                  FormsModule,
                  ReactiveFormsModule,
                  HttpModule,
                  // MaterialModule.forRoot(),
                  BrowserAnimationsModule,
                  MatDialogModule,
                  MatInputModule,
                  MatChipsModule,
                  MatTabsModule,
                  MatCardModule,
                  MatFormFieldModule,
                  MatSelectModule,
                  MatCheckboxModule,
                  MatTooltipModule,
                  DragulaModule,
                  ChartsModule,    // move to child module for dashboard
                  DragScrollModule,
                  NguCarouselModule,
                ],
  exports:      [
                  MatTabsModule,
                  MatChipsModule,
                ],
  declarations: [
                  AppComponent,
                  TermsConditionsComponent,
                  PrivacyNoticeComponent,
                  FaqComponent,

                  NavbarComponent,
                  FooterComponent,
                  HomeComponent,
                  AdminUserManagementComponent,   // move to child module for dashboard
                  LoginSignupFormComponent,
                  IconLinkComponent,

                  UserPageComponent,
                  UserSettingsComponent,         // move to child module for dashboard?

                  RequestPasswordResetComponent,
                  PasswordResetComponent,

                  NotificationsComponent,
                  ConfirmModalComponent,

                  // Custom Components
                  AddListingComponent,
                  EditListingComponent,
                  ListingPageComponent,
                  ListingFullComponent,
                  ListingCardComponent,
                  ListingCardsComponent,
                  ListingsSearchInputComponent,
                  ListingsSearchComponent,

                  UserMessagesComponent,
                  MessageBubbleComponent,

                  HoverColorDirective,
                  HoverBackgroundDirective,
                  UniqueValidatorDirective,
                  DragulaDelayLiftDirective,

                  UserConfirmationRedirectComponent,  // Really a service, but built as component

                  CallbackPipe,
                ],
  bootstrap:    [
                  AppComponent,
                ],
  providers:    [
                  AdminGuard,
                  OwnerGuard,
                  GuestService,
                  GAEventService,
                  AuthService,
                  HelpersService,
                  IconService,
                  NotificationService,
                  ModalService,
                  SignpostApi,
                  ApiAuthService,
                  ApiAdminService,
                  ApiUsersService,
                  {provide: Http,
                    useFactory: HttpFactory,
                    deps: [XHRBackend, RequestOptions, AuthService]
                  },
                ],
  entryComponents: [
                  ConfirmModalComponent,
  ]
})
export class AppModule { }
