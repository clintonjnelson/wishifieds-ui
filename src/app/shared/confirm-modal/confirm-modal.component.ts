import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { HelpersService } from '../helpers/helpers.service';

@Component({
  moduleId: module.id,
  selector: 'confirm-modal',
  templateUrl: 'confirm-modal.component.html',
  styleUrls:  ['confirm-modal.component.css']
})

export class ConfirmModalComponent {
  title: string;
  msg:   string;

  // Oauth deletion
  showCheckbox: boolean;
  checkboxMsg:  string;
  checkboxVal:  boolean = true;

  constructor(public dialogRef: MdDialogRef<ConfirmModalComponent>,
              private helpers: HelpersService) {}
}
