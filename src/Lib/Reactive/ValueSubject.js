//@flow
import Rx from 'rxjs';

import { ValueObservable} from './Observable';

export class ValueSubject<T> {
    
    _data: Rx.BehaviorSubject<T>;

    constructor(initValue: T) {
        this._data = new Rx.BehaviorSubject(initValue);
    }

    asObservable(): ValueObservable<T> {
        return new ValueObservable._create(this._data.asObservable());
    }

                                        //TODO - do wyrzucenia ta funkcja jak się zrobi porządek z draftem
    nextSync(value: T) {
        this._data.next(value);
    }

    next(value: T, afterNext?: () => void) {
        setTimeout(() => {
            this._data.next(value);

            if (afterNext) {
                afterNext();
            }
        }, 0);
    }

    getValue(): T {
        return this._data.getValue();
    }
}
                                    