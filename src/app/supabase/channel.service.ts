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

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: { autoRefreshToken: false }
    }); 
    
   }

   async listChannelsOfConnectedUser() {
    try {
      const {data, error} = await this.supabase.from('channel').select('*, channel_users(*), chats(*) '); 
      if(error){
        alert(error.message)
      }
      console.log('channels : ', data);
    } catch (error) {
      throw error; 
    }
   }

}
