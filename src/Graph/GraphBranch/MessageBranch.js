//@flow

import { ValueObservable } from 'react_reactive_value';
import GlobalStorage from '../GlobalStorage';
import MessageModel from '../Models/MessageModel';
import ModelsCollection from '../ModelsCollection';

export default class MessageBranch {

    _data: ModelsCollection<MessageModel>;

    constructor(globalStorage: GlobalStorage) {
        this._data = new ModelsCollection(globalStorage);

        globalStorage.subscribeAll((model: Object) => {
            if (model instanceof MessageModel) {
                this._data.set(model.id, model);
            }
        });
    }

    get$(id: string): ValueObservable<MessageModel | null> {
        return this._data.get(id);
    }
}
