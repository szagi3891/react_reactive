//@flow

import { ValueObservable } from 'react_reactive_value';
import GlobalStorage from '../GlobalStorage';
import ThreadModel from '../Models/ThreadModel';
import MessageModel from '../Models/MessageModel';
import Message from '../GraphBranch/MessageBranch';
import ModelsCollection from '../ModelsCollection';

export default class ThreadBranch {
    _data: ModelsCollection<ThreadModel>;
    _message: Message;

    constructor(globalStorage: GlobalStorage, message: Message) {
        this._data = new ModelsCollection(globalStorage);
        this._message = message;

        globalStorage.subscribeAll((model: Object) => {
            if (model instanceof ThreadModel) {
                this._data.set(model.id, model);
            }
        });
    }

    get$(id: string): ValueObservable<ThreadModel | null> {
        return this._data.get(id);
    }

    getLastMessage(threadId: string): ValueObservable<MessageModel | null> {
        return this._data.get(threadId)
            .switchMap(thread => {
                if (thread === null) {
                    return ValueObservable.of(null);
                }
                
                const { lastMessageId } = thread;

                if (lastMessageId === null) {
                    return ValueObservable.of(null);
                }

                return this._message.get$(lastMessageId);
            });
    }
}
