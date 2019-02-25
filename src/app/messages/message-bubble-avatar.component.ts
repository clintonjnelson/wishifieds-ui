import { Component, Input, OnInit } from '@angular/core';
import { HelpersService } from '../shared/helpers/helpers.service';
import { ApiUsersService } from '../core/api/api-users.service';
import { Message } from './message.model';

@Component({
  moduleId: module.id,
  selector: 'message-bubble-avatar',
  templateUrl: 'message-bubble-avatar.component.html',
  styleUrls: ['message-bubble-avatar.component.css', 'message-bubble.component.css']
})

// TODO: ADD AUTH FOR MESSAGES LOGIC & CREATION LOGIC/authorization
export class MessageBubbleAvatarComponent implements OnInit{
  @Input() message: Message;
  @Input() viewerIsSender: boolean;  // Triggers recipient bubble style
  @Input() toggleByAvatar: boolean = false;
  picUrl: string;
  showMessage: boolean = false;

  constructor(private helpers: HelpersService,
              private usersApi: ApiUsersService) {}

  ngOnInit() {
    this.usersApi
      .getProfilePicByUserId(this.message.senderId)
      .subscribe(
        res => {
          console.log("Got the image url!: ", res.profilePicUrl);
          this.picUrl = res.profilePicUrl;
        },
        error => {
          console.log("ERROR getting profile pic image url: ", error);
        });
  }

  displayTime(timestampString: string): string {
    return this.helpers.userDisplayTimeAgo(timestampString);
  }

  toggleShowMessage() {
    this.showMessage = !this.showMessage;
  }
}
