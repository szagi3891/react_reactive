//@flow
import Rx from 'rxjs';

export class Subscription {
    
    _data: Rx.Subscription;

    constructor(from: Rx.Subscription) {
        this._data = from;
    }

    unsubscribe() {
        this._data.unsubscribe();
    }
}
