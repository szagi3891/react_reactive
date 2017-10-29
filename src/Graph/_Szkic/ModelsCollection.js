//@flow
import GlobalStorage from './GlobalStorage';
import { ValueObservable, ValueSubject } from 'react_reactive_value';

export default class ModelsCollection<T> {
    _globalStorage: GlobalStorage;
    _data: Map<string, ValueSubject<T | null>>;

    constructor(globalStorage: GlobalStorage) {
        this._data = new Map();
    }

    get(id: string): ValueObservable<T | null> {
        const subjectValue = this._data.get(id);

        if (subjectValue) {
            return subjectValue.asObservable();
        }

        const newSubject = new ValueSubject(null);
        this._data.set(id, newSubject);
        return newSubject.asObservable();      
    }

    set(id: string, model: T | null) {
        const valueSubject = this._data.get(id);

        if (valueSubject) {
            valueSubject.next(model);
            return;
        }

        const newSubject = new ValueSubject(model);
        this._globalStorage.fetch(id);
        this._data.set(id, newSubject);
    }
}
