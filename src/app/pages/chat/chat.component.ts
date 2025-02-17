import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChannelListComponent } from '../../layout/channel-list/channel-list.component';
import { ChatsComponent } from '../../layout/chats/chats.component';
import { ChannelFormComponent } from '../../layout/channel-form/channel-form.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ ChannelListComponent, CommonModule, ChatsComponent, ChannelFormComponent ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  private auth = inject(AuthService); 
  private router = inject(Router);

  showForm = false; 
  
  constructor() {
  }

  async logOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']); 
    }).catch((err) => {alert(err.message)}); 
  }

  handleShowChannelForm() {
    this.showForm = !this.showForm; 
  }
}
