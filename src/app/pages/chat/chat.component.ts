import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'; 
import { ChatService } from '../../supabase/chat.service';
import { Ichat } from '../../interface/chat-response';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  private auth = inject(AuthService); 
  private router = inject(Router);
  private fb = inject(FormBuilder); 
  private chat_service = inject(ChatService); 

  chatForm!: FormGroup; 
  chats = signal<Ichat[]>([]); 
  
  constructor() {
    this.chatForm = this.fb.group({
      chat_message: ['', Validators.required]
    })

    effect(() => {
      this.onListChat()
    })
  }

  async logOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']); 
    }).catch((err) => {alert(err.message)}); 
  }

  onSubmit() {
    const formValue = this.chatForm.value.chat_message
    this.chat_service.chatMessage(formValue).then((response) => {
      console.log(response);
      this.chatForm.reset(); 
      this.onListChat(); 
    }).catch((err) => {
      alert(err.message)
    }); 
  }

  onListChat(){
    this.chat_service.listChat()
    .then((res: Ichat[] | null) => {
      console.log(res);
      if(res !== null){
        this.chats.set(res); 
      } else {
        console.log("No messages found");
      }
    }).catch((err) => {
      alert(err.message)
    }); 
  }
}
