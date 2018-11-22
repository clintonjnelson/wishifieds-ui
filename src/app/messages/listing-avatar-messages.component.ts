import { Component, Input, OnInit } from '@angular/core';
import { HelpersService } from '../shared/helpers/helpers.service';
import { Message } from './message.model';
import { MatBadgeModule } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'listing-avatar-messages',
  templateUrl: 'listing-avatar-messages.component.html',
  styleUrls: ['listing-avatar-messages.component.css']
})

export class ListingAvatarMessagesComponent implements OnInit {
  @Input() listingMessage: any; // Array of complex objects

  constructor(private helpers: HelpersService) {}

  ngOnInit() {
    console.log("IN LISTING AVATAR MESSAGES CONTAINER. INPUT IS: ", this.listingMessage);
  }
}
