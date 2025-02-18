import { inject, Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js'; 
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';
import { Iuser } from '../interface/user-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private supabase!: SupabaseClient ; 
  private router = inject(Router); 
  allUsers = signal<Iuser[]>([]); 

  constructor() { 
    
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: { autoRefreshToken: false }
    });
    this.supabase.auth.onAuthStateChange((event, session) => {
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

  getLoggedUser(){
    const session = localStorage.getItem('session');
    return session ? JSON.parse(session) : null;
  }

  async getAllUsers() {
    try {
      const loggedUser = this.getLoggedUser();
      const userId = loggedUser ? loggedUser.id : null;

      if (!userId) {
        throw new Error("Utilisateur loggé non trouvé");
      }
      const {data, error} = await this.supabase.from("users").select('*').neq('id', userId); 
      if(error){
        throw new Error(error.message); 
      }
      this.allUsers.set(data as Iuser[]); 
    } catch (error) {
      alert(error); 
    }
  }
}
