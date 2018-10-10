import { Component, Input, Output, ViewChild, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { IconService } from '../core/services/icon.service';
import { HelpersService } from '../shared/helpers/helpers.service';
import { Listing } from './listing.model';
import { NguCarousel } from '@ngu/carousel';



@Component({
  moduleId: module.id,
  selector: 'listing-full',
  templateUrl: 'listing-full.component.html',
  styleUrls: ['listing-full.component.css']
})
export class ListingFullComponent implements OnInit {
  @Input() listing: Listing;
  @Input() isPreview: boolean = false;  // TODO: MAKE THIS SET READONLY CAPABILITIES TO LISTING
  @Input() isEditing: boolean = false;  // TODO: Verify if should default this or Not.

  @Output() editingEE = new EventEmitter<boolean>();

  public carouselConfig: NguCarousel;
  showMessages: boolean = false;    // MAKE THIS TOGGLED PER THE MESSAGES ICON
  showLocationMap: boolean = false;
  isOwner: boolean = true;  // TODO: HOOK THIS UP; NEEDED FOR BUTTONS & SUCH.

  constructor(private icons:   IconService,
              private helpers: HelpersService,
              private router: Router) {

  }

  ngOnInit() {
    this.carouselConfig = {
      grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
      slide: 1,
      speed: 400,
      // interval: 4000,
      point: {
        visible: true
      },
      load: 2,
      touch: true,
      loop: true,
      custom: 'banner'
    }
  }

  carouselLoaded(event: Event) {
    console.log("Carousel has loaded: ", event);
  }

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }

  // For the a-link href generation
  verifyOrAddProtocolToUrl(url: string) {
    return this.helpers.verifyOrAddProtocolToUrl(url)
  }

  // For the a-link href display
  urlWithoutPrototol(url: string) {
    return this.helpers.urlWithoutProtocol(url);
  }

  toggleShowMessages() {
    this.showMessages = !this.showMessages;
  }

  toggleShowLocationMap() {
    this.showLocationMap = !this.showLocationMap;
  }

  toggleEditing(input: any = null): void {
    // Update the value locally
    if(typeof(input) === 'boolean') { this.isEditing = input; }
    else { this.isEditing = !this.isEditing; }

    console.log("EDITING TOGGLED & IS NOW: ", this.isEditing);
    // Emit the value back up the chain
    console.log("In listing-full. BUBBLING UP editingEE with value: ", this.isEditing);
    this.editingEE.emit(this.isEditing);
  }

  closeListing(): void {
    // let username = window.localStorage.getItem('username');
    // TODO: Should have a saved page that the user came from
    // TODO: Go back to that previously loaded page
    this.toggleEditing(false);
  }
}
