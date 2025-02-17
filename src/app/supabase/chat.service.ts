import { inject, Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';
import { Ichat } from '../interface/chat-response';
import { ChannelService } from './channel.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private supabase!: SupabaseClient ; 
  private channel_service = inject(ChannelService); 
  public savedChat = signal({}); 
  public messages = signal<Ichat[]>([]); 
  
  constructor() { 
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: { autoRefreshToken: false }
    });
    this.listenToNewMessages(); 
  }

  async chatMessage(text: string, idChannel: string){
    try {
      const {data, error} = await this.supabase.from('chat').insert({text, channel: idChannel}); 

      if(error) {
        alert(error.message); 
      }
    } catch (error) {
      alert(error); 
    }
    return null; 
  }

  async listChat(idChannel: string){
    if(idChannel != "") {
      try {
        const {data, error} = await this.supabase.from('chat').select('*, users(*)').eq('channel', idChannel);
        if(error){
          alert(error.message);
        }
        this.messages.set(data || []); 
      } catch (error) {
        throw error; 
      }
    } else {
      this.messages.set([]); 
    }
  }

  async deleteChat(id: string) {
    const data = await this.supabase.from('chat').delete().eq('id', id); 
    return data; 
  }

  selectedChats(msg: Ichat) {
    this.savedChat.set(msg); 

  }

  private listenToNewMessages() {
    this.supabase
    .channel('chat-room')
    .on('postgres_changes', {event: 'INSERT', schema: 'public', table: 'chat'}, (payload) => {
      if(this.channel_service.selectedChannel() == payload.new['channel']) {
        this.messages.set([...this.messages(), payload.new as Ichat])
      }
    })
    .subscribe(); 
  }
}
