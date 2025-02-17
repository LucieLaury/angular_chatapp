import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';
import { Ichannel } from '../interface/channel-response';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  private supabase!: SupabaseClient;
  public channels = signal<Ichannel[]>([]); 
  public selectedChannel = signal<string>(''); 

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: { autoRefreshToken: false }
    }); 
    
   }

   async listChannelsOfConnectedUser() {
    try {
      const {data, error} = await this.supabase.from('channel').select('*, channel_users(*)'); 
      if(error){
        alert(error.message); 
        console.error(error);
      }
      console.log('channels : ', data);
      this.channels.set(data || []); 
    } catch (error) {
      throw error; 
    }
   }

   updateSelectedChannel(idChannel: string){
    this.selectedChannel.set(idChannel); 
    console.log('maj selectedChannel : ', this.selectedChannel());
   }

}
