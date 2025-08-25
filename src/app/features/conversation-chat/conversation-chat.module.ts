// auth.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationChatRoutingModule } from './conversation-chat-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ConversationChatRoutingModule, // <-- Tích hợp route vào module
  ],
})
export class ConversationChatModule {}
