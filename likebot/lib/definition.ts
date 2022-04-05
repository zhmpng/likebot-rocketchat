import { IUIKitBlockIncomingInteraction } from '@rocket.chat/apps-engine/definition/uikit/UIKitIncomingInteractionTypes';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

export interface ILike {
    msgId: string;
    uid: string; 
    user: IUser;
    likeString: string;
    whyLiked: string;
    whoLiked: string;
}
class Like implements ILike{
 
    msgId: string;
    uid: string; 
    user: IUser;
    likeString: string;
    whyLiked: string;
    whoLiked: string;
    constructor(msgId: string,
        uid: string, 
        user: IUser,
        likeString: string,
        whyLiked: string,
        whoLiked: string,) {
 
        this.msgId = msgId;
        this.uid = uid; 
        this.user = user;
        this.likeString = likeString;
        this.whyLiked = whyLiked;
        this.whoLiked = whoLiked;
    }
}

export interface IModalContext extends Partial<IUIKitBlockIncomingInteraction> {
    threadId?: string;
}

export interface IRocketUserList {
    users:   IRocketUser[];
    count:   number;
    offset:  number;
    total:   number;
    success: boolean;
}

export interface IRocketUser {
    _id:             string;
    username:        string;
    emails?:         IRocketEmail[];
    status:          Status;
    active:          boolean;
    roles:           Role[];
    name:            string;
    avatarETag?:     string;
    nameInsensitive: string;
}

export interface IRocketEmail {
    address:  string;
    verified: boolean;
}

export enum Role {
    Admin = "admin",
    App = "app",
    Bot = "bot",
    LivechatManager = "livechat-manager",
    User = "user",
}

export enum Status {
    Away = "away",
    Offline = "offline",
    Online = "online",
}

export interface IToken {
    refresh: string;
    access: string;
}

export interface ILikeRequest {
    
    from_user: {
        id: string
    },
    to_user: {
        id: string
    },
    reason: string,
    clarification: string
}

