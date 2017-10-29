//@flow
import { database } from './firebase';

import { BaseComponent, Subject, ValueSubject, ValueObservable } from 'react_reactive_value';
import type { MessageItemType } from '../Models';

export default class ChatGraph {

    _list: ValueSubject<Array<MessageItemType>>;
    list: ValueObservable<Array<MessageItemType>>;

    _online: ValueSubject<bool>;
    online: ValueObservable<bool>;

    _sending: ValueSubject<bool>;
    sending: ValueObservable<bool>;

    constructor() {
        this._list = new ValueSubject([]);
        this.list = this._list.asObservable();

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
                currentList.push(message);
                return currentList;
            });
        });

        messages.on('child_changed', (data) => {
            console.info('child_changed', data, data.val());
        });

        messages.on('child_removed', (data) => {
            console.info('child_removed', data, data.val());
        });

        this._online = new ValueSubject(true);
        this.online = this._online.asObservable();

        database.ref(".info/connected").on("value", (snap) => {
            this._online.next(snap.val());
        });

        this._sending = new ValueSubject(false);
        this.sending = this._sending.asObservable();
    }

    send(nick: string, message: string): Promise<void> {
        const messagesRef = database.ref('rxjs-demo');

        this._sending.next(true);

        return messagesRef.push({
            nick,
            message
        }).then((response) => {
            this._sending.next(false);
            return response;
        }).catch((error: Object) => {
            this._sending.next(false);
            return Promise.reject(error);
        });
    }
}
