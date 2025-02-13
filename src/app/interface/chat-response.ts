import { Iuser } from "./user-response";

export interface Ichat {
    created_at: string; 
    editable: boolean; 
    id: string; 
    sender: string; 
    text: string; 
    users: Iuser; 
}