import { Component, EventEmitter, inject, Output,  } from '@angular/core';
import { ChannelService } from '../../supabase/channel.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-channel-list',
  imports: [CommonModule],
  templateUrl: './channel-list.component.html',
  styleUrl: './channel-list.component.scss'
})
export class ChannelListComponent {
  private channel_service = inject(ChannelService); 
  channels$ = this.channel_service.channels; 
  unreadMessages$ = this.channel_service.unreadMessages; 
  selectedChannel$ = this.channel_service.selectedChannel; 

  @Output() eventshowChannelForm = new EventEmitter(); 

  constructor () {
    this.channel_service.listChannelsOfConnectedUser(); 
  }

  updateSelectedChannel(idChannel: string) {
    this.channel_service.updateSelectedChannel(idChannel); 
  }

  showChannelForm() {
    this.eventshowChannelForm.emit(); 
  }
  
}
