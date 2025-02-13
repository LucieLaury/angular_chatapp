import { Ichat } from "./chat-response";
import { Iuser } from "./user-response";

export interface Ichannel {
    id: string, 
    created_at: string, 
    creator: string, 
    name: string, 
    participants: [
        Iuser
    ], 
    chats: [
        Ichat
    ]
}