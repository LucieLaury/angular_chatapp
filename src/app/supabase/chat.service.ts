import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';
import { Ichat } from '../interface/chat-response';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private supabase!: SupabaseClient ; 
  public savedChat = signal({}); 
  public messages = signal<Ichat[]>([]); 
  
  constructor() { 
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: { autoRefreshToken: false }
    });
    this.listenToNewMessages(); 
  }

  async chatMessage(text: string){
    try {
      const {data, error} = await this.supabase.from('chat').insert({text}); 

      if(error) {
        alert(error.message); 
      }
    } catch (error) {
      alert(error); 
    }
    return null; 
  }

  async listChat(){
    try {
      const {data, error} = await this.supabase.from('chat').select('*, users(*)');
      if(error){
        alert(error.message);
      }
      this.messages.set(data || []); 
      return data; ;
    } catch (error) {
      throw error; 
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
      console.log('nouveau message reçu : ', payload.new);
      this.messages.set([...this.messages(), payload.new as Ichat])
    })
    .subscribe(); 
  }
}
