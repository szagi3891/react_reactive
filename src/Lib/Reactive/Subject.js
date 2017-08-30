//@flow
import Rx from 'rxjs';

import { Observable, ValueObservable } from './Observable';

export class Subject<T> {

    _data: Rx.Subject<T>;

    constructor() {
        this._data = new Rx.Subject();
    }

    asObservable(): Observable<T> {
        return Observable._create(this._data.asObservable());
    }

    scan<S>(initState: S, reducer: (prevState: S, command: T) => S): ValueObservable<S> {
        return this.asObservable().scan(initState, reducer);
    }

    next(value: T) {
        this._data.next(value);
    }

    complete() {
        this._data.complete();
    }
    
}
