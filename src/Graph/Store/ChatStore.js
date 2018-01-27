//@flow
import { database } from './firebase';

import { Value, Computed } from 'computed-values';
import RenderManager from '../RenderManager';
import ChatMessageStore from './ChatMessageStore';

export default class ChatStore {

    +_chatMessage: ChatMessageStore;

    +_list: Value<Array<string>>;
    +list$: Computed<Array<string>>;

    +_online: Value<bool>;
    +online$: Computed<bool>;

    +_sending: Value<bool>;
    +sending$: Computed<bool>;

    constructor(chatMessage: ChatMessageStore) {
        this._chatMessage = chatMessage;

        this._list = new Value([]);
        this.list$ = this._list.asComputed();

        const messages = database.ref('rxjs-demo');
 
        messages.on('child_added', (messageItem) => {
            this._list.update(currentList => {
                const id = messageItem.key;
                const messageVal = messageItem.val();

                if (typeof id === 'string') {
                    this._chatMessage.set(id, {
                        id,
                        nick: messageVal.nick,
                        message: messageVal.message
                    });
                    currentList.push(id);
                }

                return currentList;
            });
        });

        messages.on('child_changed', (data) => {
            console.info('child_changed', data, data.val());
        });

        messages.on('child_removed', (data) => {
            console.info('child_removed', data, data.val());
        });

        this._online = new Value(true);
        this.online$ = this._online.asComputed();

        database.ref(".info/connected").on("value", (snap) => {
            this._online.setValue(snap.val());
        });

        this._sending = new Value(false);
        this.sending$ = this._sending.asComputed();
    }

    send(nick: string, message: string): Promise<void> {
        const messagesRef = database.ref('rxjs-demo');

        this._sending.setValue(true);

        return messagesRef.push({
            nick,
            message
        }).then((response) => {
            this._sending.setValue(false);
            return response;
        }).catch((error: mixed) => {
            this._sending.setValue(false);
            return Promise.reject(error);
        });
    }

    get sending(): bool {
        return RenderManager.getValue$(this.sending$);
    }

    get online(): bool {
        return RenderManager.getValue$(this.online$);
    }

    get list(): Array<string> {
        return RenderManager.getValue$(this.list$);
    }
}
