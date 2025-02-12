import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js'; 
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private supabase!: SupabaseClient ; 

  constructor() { 
    
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: { autoRefreshToken: false }
    });
    this.supabase.auth.onAuthStateChange((event, session) => {
      console.log("event", event); 
      console.log("session", session);
    }); 
  }
 

  async signInWithGoogle() {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google'
    }); 
    if(error){
      console.error("Erreur d'authentification Google : ", error);
    }
  }

  async signOut() {
    await this.supabase.auth.signOut(); 
  }
}
