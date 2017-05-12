import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';

@Injectable()

export class ModalService {

  constructor(private dialog: MdDialog) {}

  public confirm(title:        string,
                 msg:          string,
                 showCheckbox: boolean = null,
                 checkboxMsg:  string  = null): Observable<any> {
    // Use this component
    let dialogRef: MdDialogRef<ConfirmModalComponent>;
    const config = new MdDialogConfig();

    dialogRef = this.dialog.open(ConfirmModalComponent, config);
    dialogRef.componentInstance.title        = title;
    dialogRef.componentInstance.msg          = msg;
    dialogRef.componentInstance.showCheckbox = showCheckbox;
    dialogRef.componentInstance.checkboxMsg  = checkboxMsg;

    return dialogRef.afterClosed();
  }
}
