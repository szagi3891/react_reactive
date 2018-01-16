//@flow
import { database } from './firebase';

import { Value, ValueComputed } from '../../Value';
import GraphRenderManager from '../GraphRenderManager';
import ChatMessageGraph from './ChatMessageGraph';

export default class ChatGraph {

    _chatMessage: ChatMessageGraph;

    _list: Value<Array<string>>;
    list$: ValueComputed<Array<string>>;

    _online: Value<bool>;
    online$: ValueComputed<bool>;

    _sending: Value<bool>;
    sending$: ValueComputed<bool>;

    constructor(chatMessage: ChatMessageGraph) {
        this._chatMessage = chatMessage;

        this._list = new Value([]);
        this.list$ = this._list.asComputed();

        const messages = database.ref('rxjs-demo');
 
        messages.on('child_added', (messageItem) => {
            this._list.update(currentList => {
                const messageKey = messageItem.key;
                const messageVal = messageItem.val();
                const message = {
                    id: messageKey,
                    nick: messageVal.nick,
                    message: messageVal.message
                }

                this._chatMessage.set(message.id, message);
                currentList.push(message.id);

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
        }).catch((error: Object) => {
            this._sending.setValue(false);
            return Promise.reject(error);
        });
    }

    get sending(): bool {
        return GraphRenderManager.getValue$(this.sending$);
    }

    get online(): bool {
        return GraphRenderManager.getValue$(this.online$);
    }

    get list(): Array<string> {
        return GraphRenderManager.getValue$(this.list$);
    }
}
