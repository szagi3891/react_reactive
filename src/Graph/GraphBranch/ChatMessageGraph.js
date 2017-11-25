//@flow

import { ValueSubject, ValueObservable } from 'react_reactive_value';

import GraphRenderManager from '../GraphRenderManager';
import type { MessageItemType } from '../Models';

export default class ChatMessage {

    _data: Map<string, ValueSubject<MessageItemType | null>>;

    constructor() {
        this._data = new Map();
    }

    set(id: string, model: MessageItemType) {
        const item = this._data.get(id);
        if (item) {
            item.next(model);
            return;
        }

        const newItem = new ValueSubject(model);
        this._data.set(id, newItem);
    }

    get$(id: string): ValueObservable<MessageItemType | null> {
        const item = this._data.get(id);
        if (item) {
            return item.asObservable();
        }

        const newSub = new ValueSubject(null);
        this._data.set(id, newSub);
        return newSub.asObservable();
    }

    get(id: string): MessageItemType | null {
        return GraphRenderManager.getValue$(this.get$(id));
    }
}
