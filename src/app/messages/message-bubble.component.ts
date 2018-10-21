import { Component, Input } from '@angular/core';
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
}
