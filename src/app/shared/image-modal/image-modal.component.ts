import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { IconService } from '../../core/services/icon.service';
import { Listing } from '../../listings/listing.model';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'image-modal',
  templateUrl: 'image-modal.component.html',
  styleUrls:  ['image-modal.component.css']
})

export class ImageModalComponent {
  images: string[];
  link: string;

  constructor(public dialogRef: MatDialogRef<ImageModalComponent>,
              private icons: IconService,
              private router: Router
              ) {}

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }

  // clickedModalImage() {
  //   console.log("MADE IT TO THE MODAL REDIRECT & CLOSE!!")
  //   if(this.link) {
  //     this.dialogRef.close();
  //     this.router.navigateByUrl(this.link);
  //   }
  // }
}
