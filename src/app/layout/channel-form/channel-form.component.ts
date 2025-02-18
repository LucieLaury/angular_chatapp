import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Iuser } from '../../interface/user-response';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-channel-form',
  imports: [CommonModule],
  templateUrl: './channel-form.component.html',
  styleUrl: './channel-form.component.scss'
})
export class ChannelFormComponent {
  private auth_service = inject(AuthService); 
  allUsers$ = this.auth_service.allUsers; 
  selectedParticipants = signal<Iuser[]>([]); 
  
  constructor() {
    this.auth_service.getAllUsers(); 
  }

  addParticipant(event: any){
    const idUser = event.target.value;
    if(this.selectedParticipants().some((elem) => elem.id != idUser)) {
      console.log('ici');
      const user = this.allUsers$().find((elem) => {
        elem.id == idUser
      }); 
  
      if (user){
        this.selectedParticipants.set([...this.selectedParticipants(), user]); 
      }
    }
    console.log('list participants : ', this.selectedParticipants());
  }

}
