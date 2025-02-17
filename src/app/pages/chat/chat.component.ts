import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'; 
import { ChatService } from '../../supabase/chat.service';
import { Ichat } from '../../interface/chat-response';
import { CommonModule, DatePipe } from '@angular/common';
import { DeleteModalComponent } from '../../layout/delete-modal/delete-modal.component';
import { ChannelListComponent } from '../../layout/channel-list/channel-list.component';
import { ChannelService } from '../../supabase/channel.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, DeleteModalComponent, ChannelListComponent, CommonModule ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  private auth = inject(AuthService); 
  private router = inject(Router);
  private fb = inject(FormBuilder); 
  private chat_service = inject(ChatService); 
  private channel_service = inject(ChannelService); 

  chatForm!: FormGroup; 
  // chats = signal<Ichat[]>([]); 
  messages$ = this.chat_service.messages; 
  selectedChannel$ = this.channel_service.selectedChannel; 
  
  constructor() {
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

  async logOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']); 
    }).catch((err) => {alert(err.message)}); 
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
