import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImageModalComponent } from './image-modal.component';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { Listing } from '../../listings/listing.model';

@Injectable()

export class ImageModalService {

  constructor(private dialog: MatDialog) {}

  // Trigger opening of the modal
  public view(images: string[], link: string): Observable<any> {
    // Use this component
    let dialogRef: MatDialogRef<ImageModalComponent>;
    const config = new MatDialogConfig();

    // This is how you open component modal
    dialogRef = this.dialog.open(ImageModalComponent, config);

    // This is how you pas stuff into the component modal
    dialogRef.componentInstance.images = images;
    dialogRef.componentInstance.link = link;

    return dialogRef.afterClosed();  // When closed is triggered in UI...
  }
}
