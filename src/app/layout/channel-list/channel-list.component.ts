import { Component, inject,  } from '@angular/core';
import { ChannelService } from '../../supabase/channel.service';
@Component({
  selector: 'app-channel-list',
  imports: [],
  templateUrl: './channel-list.component.html',
  styleUrl: './channel-list.component.scss'
})
export class ChannelListComponent {
  private channel_service = inject(ChannelService); 
  channels$ = this.channel_service.channels; 
  constructor () {
    this.channel_service.listChannelsOfConnectedUser(); 
  }

  updateSelectedChannel(idChannel: string) {
    this.channel_service.updateSelectedChannel(idChannel); 
  }
  
}
