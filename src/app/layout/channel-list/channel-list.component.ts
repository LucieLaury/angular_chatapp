import { Component, inject,  } from '@angular/core';
import { ChannelService } from '../../supabase/channel.service';
@Component({
  selector: 'app-channel-list',
  imports: [],
  templateUrl: './channel-list.component.html',
  styleUrl: './channel-list.component.scss'
})
export class ChannelListComponent {
  private chanel_service = inject(ChannelService); 
  channels$ = this.chanel_service.channels; 

  
}
