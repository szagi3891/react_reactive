//@flow

import ChatMessageStore from './ChatMessageStore';
import ChatStore from './ChatStore';

export default class Store {

    chatMessage: ChatMessageStore;
    chat: ChatStore;

    constructor() {
        this.chatMessage = new ChatMessageStore();
        this.chat = new ChatStore(this.chatMessage);
    }
}
