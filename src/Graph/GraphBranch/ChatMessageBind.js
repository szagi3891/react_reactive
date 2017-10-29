//@flow
import { ValueObservable } from 'react_reactive_value';
import ChatMessageGraph from './ChatMessageGraph';
import type { MessageItemType } from '../Models';

export default class ChatMessageBind {
    
    _chatMessage: ChatMessageGraph;
    _getValue$: <T>(ValueObservable<T>) => T;

    constructor(chatMessage: ChatMessageGraph, getValue$: <T>(ValueObservable<T>) => T) {
        this._chatMessage = chatMessage;
        this._getValue$ = getValue$;
    }

    get(id: string): MessageItemType | null {
        return this._getValue$(this._chatMessage.get$(id));
    }
}

