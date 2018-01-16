//@flow

import { Value, ValueComputed } from '../../Value';

import GraphRenderManager from '../GraphRenderManager';
import type { MessageItemType } from '../Models';

export default class ChatMessage {

    _data: Map<string, Value<MessageItemType | null>>;

    constructor() {
        this._data = new Map();
    }

    set(id: string, model: MessageItemType) {
        const item = this._data.get(id);
        if (item) {
            item.setValue(model);
            return;
        }

        const newItem = new Value(model);
        this._data.set(id, newItem);
    }

    get$(id: string): ValueComputed<MessageItemType | null> {
        const item = this._data.get(id);
        if (item) {
            return item.asComputed();
        }

        const newSub = new Value(null);
        this._data.set(id, newSub);
        return newSub.asComputed();
    }

    get(id: string): MessageItemType | null {
        return GraphRenderManager.getValue$(this.get$(id));
    }
}
