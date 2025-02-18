import { Component, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatService } from '../../supabase/chat.service';
import { ChannelService } from '../../supabase/channel.service';
import { Ichat } from '../../interface/chat-response';
import { CommonModule, DatePipe } from '@angular/common';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';

@Component({
  selector: 'app-chats',
  imports: [CommonModule, DeleteModalComponent, DatePipe, ReactiveFormsModule],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss'
})
export class ChatsComponent {
  private fb = inject(FormBuilder); 
  private chat_service = inject(ChatService); 
  private channel_service = inject(ChannelService); 

  chatForm!: FormGroup; 
  messages$ = this.chat_service.messages; 
  selectedChannel$ = this.channel_service.selectedChannel; 
  constructor () {
    this.chatForm = this.fb.group({
      chat_message: ['', Validators.required]
    })
    this.chat_service.listChat(this.channel_service.selectedChannel()); 

    effect(() => {
      const selectedChannelId = this.channel_service.selectedChannel();
      if (selectedChannelId) {
        this.chat_service.listChat(selectedChannelId);
      }
    });
  }

  onSubmit() {
    const formValue = this.chatForm.value.chat_message
    const selectedChannel = this.channel_service.selectedChannel(); 
    if(selectedChannel != "") {
      this.chat_service.chatMessage(formValue, selectedChannel).then(() => {
        this.chatForm.reset(); 
      })
      .catch((err) => {
        alert(err.message); 
      })
    }

  }

  openDropDown(msg: Ichat) {
    this.chat_service.selectedChats(msg); 
  }
}
