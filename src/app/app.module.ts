//// This file exists to establish key facts about the ENTIRE app
// Modules
const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};
import { NgModule }        from '@angular/core';
import { BrowserModule }   from '@angular/platform-browser';
import { RouterModule }    from '@angular/router';
import { AppRouterModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule }     from '@angular/forms';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { MatDialogModule, MatInputModule, MatTooltipModule, MatFormFieldModule,
  MatSelectModule, MatCheckboxModule, MatTabsModule, MatChipsModule, MatCardModule,
  MatBadgeModule, MatIconModule, MatAutocompleteModule, MatSnackBarModule } from '@angular/material';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragulaModule }    from 'ng2-dragula';  // TO USE, SEE NEW DOCS FOR NEW API
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { FileUploadModule } from 'ng2-file-upload';
import { ChartsModule }        from 'ng2-charts/ng2-charts';
import 'hammerjs';

// Core Components (From Template)
import { AppComponent }                  from './app.component';
import { TermsConditionsComponent }      from './static-pages/terms-conditions/terms-conditions.component';
import { PrivacyNoticeComponent }        from './static-pages/privacy-notice/privacy-notice.component';
import { FaqComponent }                  from './static-pages/faq/faq.component';
import { ConfirmationStatusPageComponent } from './external/confirmation-status-page.component';

import { FontAwesomeModule }             from '@fortawesome/angular-fontawesome';
import { IconLinkComponent }             from './shared/icon-links/icon-links.component';
import { BadgeComponent }                from './shared/badges/badge.component';
import { NavbarComponent }               from './navigation/navbar/navbar.component';
import { FooterComponent }               from './footer/footer.component';

import { AdminUserManagementComponent }  from './admin/user-management/admin-user-management.component';
import { HomeComponent }                 from './home/home.component';

import { LoginSignupFormComponent }      from './users/login-signup-form/login-signup-form.component';
import { UserPageComponent }             from './users/user-page.component';
import { UserSettingsComponent }         from './users/settings/user-settings.component';
import { UserLocationsManagerComponent } from './users/settings/user-locations-manager.component';

import { RequestPasswordResetComponent } from './password-reset/request-password-reset.component';
import { PasswordResetComponent }        from './password-reset/password-reset.component';

import { NotificationsComponent }        from './notifications/notifications.component';
import { DataConsentBannerComponent }    from './shared/notifications/data-consent-banner.component';
import { AlertsService }                 from './core/services/alerts.service';
import { ConfirmModalComponent }         from './shared/confirm-modal/confirm-modal.component';
import { ImageModalComponent }           from './shared/image-modal/image-modal.component';

// Custom Components
import { AddListingComponent }              from './listings/add-listing.component';
import { EditListingComponent }             from './listings/edit-listing.component';
import { ListingPageComponent }             from './listings/listing-page.component';
import { ListingFullComponent }             from './listings/listing-full.component';
import { ListingCardComponent }             from './listings/listing-card.component';
import { ListingCardsComponent }            from './listings/listing-cards.component';
import { ListingsSearchComponent }          from './listings/search/listings-search.component';
import { ListingsSearchResultsComponent }   from './listings/search/listings-search-results.component';

import { AddTagsComponent }                 from './tags/add-tags.component';

import { UserMessagesComponent }            from './messages/user-messages.component';
import { ListingMessagesSelectorComponent } from './messages/listing-messages-selector.component';
import { ListingAvatarMessagesComponent }   from './messages/listing-avatar-messages.component';
import { MessagesByListingComponent }       from './messages/messages-by-listing.component';
import { MessageBubbleComponent }           from './messages/message-bubble.component';
import { MessageBubbleAvatarComponent }     from './messages/message-bubble-avatar.component';

import { ImgCarouselComponent }             from './shared/carousel/img-carousel.component';
import { MarkerMapComponent }               from './shared/maps/marker-map.component';
import { LocationTAMarkerMapComponent }     from './shared/maps/location-ta-marker-map.component';
import { ListingsSearchMapComponent }       from './listings/search/listings-search-map.component';
import { ListingsSearchAnalyticsComponent } from './listings/search/listings-search-analytics.component';

// Directives
import { HoverColorDirective }              from './shared/hover-color/hover-color.directive';
import { HoverBackgroundDirective }         from './shared/hover-background/hover-background.component';
import { UniqueValidatorDirective }         from './shared/validators/unique.directive';
import { DragulaDelayLiftDirective }        from './shared/dragula-delay-lift/dragula-delay-lift.directive';
import { SquareWidthElementDirective }      from './shared/directives/square-width-element.directive';

// Services - make them available EVERYWHERE (otherwise, just add it specifically into Component as a provider)
import { HttpIntercept }                     from './core/api/http-intercept';
import { AuthService }                       from './core/auth/auth.service';
import { GuestService }                      from './core/services/guest.service';
import { GAEventService }                    from './core/services/ga-event.service';
import { NotificationService }               from './core/services/notification.service';
import { ConfirmModalService }               from './shared/confirm-modal/confirm-modal.service';
import { ImageModalService }                 from './shared/image-modal/image-modal.service';
import { WishifiedsApi }                     from './core/api/wishifieds-api.service';
import { ApiAuthService }                    from './core/api/api-auth.service';
import { ApiOauthService }                   from './core/api/api-oauth.service';
import { ApiAdminService }                   from './core/api/api-admin.service';
import { ApiTagsService }                    from './core/api/api-tags.service';
import { ApiImagesService }                  from './core/api/api-images.service';
import { ApiListingsService }                from './core/api/api-listings.service';
import { ApiLocationsService }               from './core/api/api-locations.service';
import { ApiFavoritesService }               from './core/api/api-favorites.service';
import { ApiMessagesService }                from './core/api/api-messages.service';
import { ApiSearchService }                  from './core/api/api-search.service';
import { ApiUsersService }                   from './core/api/api-users.service';
import { ApiUsersLocationsService }          from './core/api/api-users-locations.service';
import { HelpersService }                    from './shared/helpers/helpers.service';
import { IconService }                       from './core/services/icon.service';
import { OauthRedirectComponent }            from './core/redirects/oauth-redirect.component';  // not really a component
import { UserConfirmationRedirectComponent } from './core/redirects/user-confirmation-redirect.component';

// Guards
import { AdminGuard } from './core/auth/admin-guard.service';
import { OwnerGuard } from './core/auth/owner-guard.service';

// Pipes
import { CallbackPipe } from './shared/pipes/callback.pipe';

// Providers
export function HttpFactory(backend: XHRBackend,
                            defaultOptions: RequestOptions,
                            authService: AuthService,
                            alertsService: AlertsService) {
  return new HttpIntercept(backend, defaultOptions, authService, alertsService);
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
                  FontAwesomeModule,
                  MatDialogModule,
                  MatInputModule,
                  MatChipsModule,
                  MatTabsModule,
                  MatCardModule,
                  MatIconModule,
                  MatFormFieldModule,
                  MatSelectModule,
                  MatCheckboxModule,
                  MatTooltipModule,
                  MatBadgeModule,
                  MatSnackBarModule,
                  MatAutocompleteModule,
                  ScrollDispatchModule,
                  DragulaModule.forRoot(),  // ROOT means SINGLETON
                  ChartsModule,    // move to child module for dashboard OR REMOVE FOR NOW
                  SwiperModule,
                  FileUploadModule
                ],
  exports:      [
                  MatTabsModule,  // I think this is useless
                  MatChipsModule,  // I think this is useless
                ],

  // For stuff in the HTML
  declarations: [
                  AppComponent,
                  TermsConditionsComponent,
                  PrivacyNoticeComponent,
                  FaqComponent,
                  ConfirmationStatusPageComponent,

                  NavbarComponent,
                  FooterComponent,
                  HomeComponent,
                  AdminUserManagementComponent,   // move to child module for dashboard
                  LoginSignupFormComponent,
                  IconLinkComponent,
                  BadgeComponent,

                  UserPageComponent,
                  UserSettingsComponent,         // move to child module for dashboard?
                  UserLocationsManagerComponent,

                  RequestPasswordResetComponent,
                  PasswordResetComponent,

                  NotificationsComponent,
                  DataConsentBannerComponent,
                  ConfirmModalComponent,
                  ImageModalComponent,
                  MarkerMapComponent,
                  LocationTAMarkerMapComponent,
                  ListingsSearchMapComponent,
                  ListingsSearchAnalyticsComponent,

                  // Custom Components
                  AddListingComponent,
                  EditListingComponent,
                  ListingPageComponent,
                  ListingFullComponent,
                  ListingCardComponent,
                  ListingCardsComponent,
                  ListingsSearchComponent,
                  ListingsSearchResultsComponent,
                  AddTagsComponent,

                  UserMessagesComponent,
                  MessageBubbleComponent,
                  MessageBubbleAvatarComponent,
                  ListingMessagesSelectorComponent,
                  ListingAvatarMessagesComponent,
                  MessagesByListingComponent,

                  ImgCarouselComponent,
                  HoverColorDirective,
                  HoverBackgroundDirective,
                  UniqueValidatorDirective,
                  DragulaDelayLiftDirective,
                  SquareWidthElementDirective,

                  OauthRedirectComponent,
                  UserConfirmationRedirectComponent,  // Really a service, but built as component

                  CallbackPipe,
                ],
  bootstrap:    [
                  AppComponent,
                ],

  // For DI in the Constructors
  providers:    [
                  AdminGuard,
                  OwnerGuard,
                  GuestService,
                  GAEventService,
                  AuthService,
                  AlertsService,
                  HelpersService,
                  IconService,
                  NotificationService,
                  ImageModalService,
                  ConfirmModalService,
                  WishifiedsApi,
                  ApiAuthService,
                  ApiOauthService,
                  ApiAdminService,
                  ApiTagsService,
                  ApiImagesService,
                  ApiListingsService,
                  ApiLocationsService,
                  ApiFavoritesService,
                  ApiMessagesService,
                  ApiSearchService,
                  ApiUsersService,
                  ApiUsersLocationsService,
                  {provide: Http,
                    useFactory: HttpFactory,
                    deps: [XHRBackend, RequestOptions, AuthService, AlertsService]
                  },
                  {
                    provide: SWIPER_CONFIG,
                    useValue: DEFAULT_SWIPER_CONFIG
                  }
                ],
  entryComponents: [
                  ConfirmModalComponent,
                  ImageModalComponent,
                  DataConsentBannerComponent,
  ]
})
export class AppModule { }
