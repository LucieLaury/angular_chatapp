import { Component, effect, inject, signal } from '@angular/core';
import { ChatService } from '../../supabase/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-modal',
  imports: [],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss'
})
export class DeleteModalComponent {

  private chat_service = inject(ChatService); 
  private router = inject(Router); 
  dismiss = signal(false); 

  constructor() {
    effect(() => {
      console.log(this.chat_service.savedChat());
    })
  }

  deleteChat(){
    const id = (this.chat_service.savedChat() as {id: string}).id;
    this.chat_service.deleteChat(id).then(() => {
      let currentUrl = this.router.url;
      this.dismiss.set(true);   
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl])
      })
    }).catch((err) => {
      alert(err.message);
    })
  }
}
