import { Component, Input } from '@angular/core';
import { HelpersService } from '../shared/helpers/helpers.service';
import { Message } from './message.model';

@Component({
  moduleId: module.id,
  selector: 'message-bubble',
  templateUrl: 'message-bubble.component.html',
  styleUrls: ['message-bubble.component.css']
})

// TODO: ADD AUTH FOR MESSAGES LOGIC & CREATION LOGIC/authorization
export class MessageBubbleComponent {
  @Input() message: Message;
  @Input() viewerIsSender: boolean;  // Triggers recipient bubble style

  constructor(private helpers: HelpersService) {}

  displayTime(timestampString: string): string {
    return this.helpers.userDisplayTimeAgo(timestampString);
  }
}
