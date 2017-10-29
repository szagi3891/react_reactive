//@flow
import { ValueObservable } from 'react_reactive_value';
import ChatGraph from './ChatGraph';
import type { MessageItemType } from '../Models';

export default class ChatGraphBind {
    
    _chatList: ChatGraph;
    _getValue$: <T>(ValueObservable<T>) => T;

    constructor(chatList: ChatGraph, getValue$: <T>(ValueObservable<T>) => T) {
        this._chatList = chatList;
        this._getValue$ = getValue$;
    }

    get online(): bool {
        return this._getValue$(this._chatList.online);
    }

    get sending(): bool {
        return this._getValue$(this._chatList.sending);
    }

    get list(): Array<MessageItemType> {
        return this._getValue$(this._chatList.list);
    }

    send(nick: string, message: string) {
        return this._chatList.send(nick, message);
    }
}
