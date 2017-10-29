//@flow
import { ValueObservable } from 'react_reactive_value';
import ChatGraph from './ChatGraph';

export default class ChatBind {
    
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

    get list(): Array<string> {
        return this._getValue$(this._chatList.list);
    }

    send(nick: string, message: string) {
        return this._chatList.send(nick, message);
    }
}
