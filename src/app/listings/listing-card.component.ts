import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { IconService }         from '../core/services/icon.service';
import { MatChipInputEvent }   from '@angular/material/chips';
import { HelpersService }      from '../shared/helpers/helpers.service';
// import { DragScrollComponent } from 'ngx-drag-scroll';
// import { NguCarousel } from '@ngu/carousel';
import { ImgCarouselComponent } from '../shared/carousel/img-carousel.component';
import { Listing }             from './listing.model';

export class PriceDisplay {
  display: string;
  symbol: string;
}

@Component({
  moduleId: module.id,
  selector: 'listing-card',
  templateUrl: 'listing-card.component.html',
  styleUrls: ['listing-card.component.css']
})


export class ListingCardComponent implements OnInit {
  @Input() listing: Listing;
  // @ViewChild('nav', {read: DragScrollComponent}) ds: DragScrollComponent;  // TODO: maybe change naming to images or scroll?
  expandedInfo = false;
  price: PriceDisplay;
  // public carouselConfig = {
  //   grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
  //   slide: 1,
  //   speed: 400,
  //   // interval: {},
  //   point: {
  //     visible: true
  //   },
  //   load: 2,
  //   velocity: 0,
  //   touch: true,
  //   loop: true,
  //   custom: 'banner',
  //   easing: 'cubic-bezier(0, 0, 0.2, 1)'
  // };

  constructor( private icons: IconService,
               private helpers: HelpersService) {
  }

  ngOnInit() {
    this.buildMiniPrice();
  }
  // carouselLoaded(event: Event) {
  //   console.log("Carousel has loaded: ", event);
  // }
  // moveLeft() {
  //   this.ds.moveLeft();
  // }
  // moveRight() {
  //   this.ds.moveRight();
  // }

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }

  buildMiniPrice() {
     this.price = this.helpers.miniPrice(this.listing.price);
  }

  // For the a-link href generation
  verifyOrAddProtocolToUrl(url: string) {
    return this.helpers.verifyOrAddProtocolToUrl(url)
  }

  // For the a-link href display
  urlWithoutPrototol(url: string) {
    return this.helpers.urlWithoutProtocol(url);
  }

  // Logged OUT Helpers
  toggleInfoContainerExpand(input: any = null): void {
    // Trigger GA tracking
    // this.gaClick('loginsignupexpand');

    console.log("TOGGLING TO: ", !this.expandedInfo);

    // If setting value directly, do that.
    if(typeof(input) === 'boolean') {
      this.expandedInfo = input;
    }
    // Else, just toggle the value
    else {
      this.expandedInfo = !this.expandedInfo;
    }
  }
}







