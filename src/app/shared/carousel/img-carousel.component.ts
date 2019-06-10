import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Listing } from '../../listings/listing.model';
import { SwiperComponent, SwiperDirective, SwiperConfigInterface,
  SwiperScrollbarInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { ImageModalService }   from '../../shared/image-modal/image-modal.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'img-carousel',
  templateUrl: './img-carousel.component.html',
  styleUrls: ['./img-carousel.component.css']
})
export class ImgCarouselComponent {
  @Input() images: string[];
  @Input() link: string;
  @Input() modal: boolean;
  @ViewChild(SwiperComponent) componentRef?: SwiperComponent;

  index = 0;
  config: SwiperConfigInterface = {
    a11y: true,
    direction: 'horizontal',
    slidesPerView: 1,
    keyboard: true,
    mousewheel: true,
    scrollbar: false,
    navigation: true,
    pagination: false
  };

  constructor(private router: Router,
              private imageModalService: ImageModalService,
              private allModalDialogRef: MatDialog) {}

  // Check open modal first; open or check for a link if no modal
  // Only redirect for passed link (some carousel images don't link out)
  clickedImage() {
    if(this.modal) {
      this.imageModalService.view(this.images, this.link);
    }
    else if(this.link) {
      // FIXME: THIS IS RISKY CLOSING ALL!!! GET THIS MOR FINE-GRAINED TO THE CHILD MODAL!!!
      // VERIFY: COMPONENTS ARE ON AN INSTANCE BASIS INSTEAD OF SERVICE SINGLETON? SO MAYBE
      this.allModalDialogRef.closeAll();
      this.router.navigateByUrl(this.link);
    }
  }
}

// listing-display-main-container
  // height 100%  // This will correct the overlap of bubbles & picture

// These need to match (maybe the inner ones can be just set to 100% match)
  // div> swiper-slide-active  => width
  // img> => width
  // div.swiper-container.swiper-containe-horizontal => width
  // div.swiper-slide.swipter-slide-active => width

// div.swiper-button-next =>
  // ACTIVE: data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23808080'%2F%3E%3C%2Fsvg%3E
  // INACTIVE: data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23d3d3d3'%2F%3E%3C%2Fsvg%3E
// div.swiper-button-prev =>
  // ACTIVE:  data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23808080'%2F%3E%3C%2Fsvg%3E
  // INACTIVE: data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23d3d3d3'%2F%3E%3C%2Fsvg%3E
