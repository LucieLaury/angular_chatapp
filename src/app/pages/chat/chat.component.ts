import { Component, effect, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'; 
import { ChatService } from '../../supabase/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  private auth = inject(AuthService); 
  private router = inject(Router);
  private fb = inject(FormBuilder); 
  private chat_service = inject(ChatService); 

  chatForm!: FormGroup; 
  
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
    }).catch((err) => {
      alert(err.message)
    }); 
  }

  onListChat(){
    this.chat_service.listChat().then((res) => {
      console.log(res);
    }).catch((err) => {
      alert(err.message)
    }); 
  }
}
