import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';

@Injectable()

export class ModalService {

  constructor(private dialog: MdDialog) {}

  public confirm(title: string, msg: string): Observable<boolean> {
    // Use this component
    let dialogRef: MdDialogRef<ConfirmModalComponent>;
    let config = new MdDialogConfig();
    //config.viewContainerRef = viewContainerRef;  // Said don't need this anymore

    dialogRef = this.dialog.open(ConfirmModalComponent, config);
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.msg   = msg;

    return dialogRef.afterClosed();
  }
}
