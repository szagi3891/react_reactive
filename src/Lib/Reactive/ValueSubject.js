//@flow
import Rx from 'rxjs';

import { ValueObservable} from './Observable';

export class ValueSubject<T> {
    
    _data: Rx.BehaviorSubject<T>;

    constructor(initValue: T) {
        this._data = new Rx.BehaviorSubject(initValue);
    }

    asObservable(): ValueObservable<T> {
        return ValueObservable._create(this._data.asObservable());
    }

    next(value: T) {
        this._data.next(value);
    }

    getValue(): T {
        return this._data.getValue();
    }
}
                                    