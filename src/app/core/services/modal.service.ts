import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';

@Injectable()

export class ModalService {

  constructor(private dialog: MatDialog) {}

  public confirm(title:        string,
                 msg:          string,
                 showCheckbox: boolean = null,
                 checkboxMsg:  string  = null): Observable<any> {
    // Use this component
    let dialogRef: MatDialogRef<ConfirmModalComponent>;
    const config = new MatDialogConfig();

    dialogRef = this.dialog.open(ConfirmModalComponent, config);
    dialogRef.componentInstance.title        = title;
    dialogRef.componentInstance.msg          = msg;
    dialogRef.componentInstance.showCheckbox = showCheckbox;
    dialogRef.componentInstance.checkboxMsg  = checkboxMsg;

    return dialogRef.afterClosed();
  }
}
