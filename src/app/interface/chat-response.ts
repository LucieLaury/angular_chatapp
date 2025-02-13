import { Users } from "./users-response";
export interface Ichat {
    created_at: string; 
    editable: boolean; 
    id: string; 
    sender: string; 
    text: string; 
    users: Users; 
}