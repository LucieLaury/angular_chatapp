import { inject, Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js'; 
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private supabase!: SupabaseClient ; 
  private router = inject(Router); 

  constructor() { 
    
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: { autoRefreshToken: false }
    });
    this.supabase.auth.onAuthStateChange((event, session) => {
      // console.log("event", event); 
      // console.log("session", session);
      if (typeof window !== 'undefined') 
        localStorage.setItem('session', JSON.stringify(session?.user)); 

      if(session?.user) {
        this.router.navigate(['/chat']); 
      }
    }); 
  }

  get isLoggedIn(): boolean {
    
    const user = localStorage.getItem('session') as string; 

    return user === 'undefined' ? false : true; 
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
