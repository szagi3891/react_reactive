//@flow

import { ValueSubscription } from './ValueSubscription';
import { ValueComputed } from './ValueComputed';

export class Value<T> {
    _value: T;
    _subscription: ValueSubscription;

    constructor(value: T) {
        this._value = value;
        this._subscription = new ValueSubscription(() => {});
    }

    setValue(newValue: T) {
        this._value = newValue;
        this._notify();
    }

    getValue(): T {
        return this._value;
    }

    _notify() {
        const allToRefresh = this._subscription.notify();

        //TODO - zmienna allToRefresh będzie przekazywana do manegera tranzakcji

                                            //wywołanie wszystkich funkcji odświeżających komponenty
        for (const item of allToRefresh) {
            item();
        }
    }

    update(fnUpdate: (old: T) => T) {
        //TODO - obczaić senderSync w kontekście nowej reprezentacji
        this._value = fnUpdate(this._value);
        this._notify();
    }

    asComputed(): ValueComputed<T> {
        return new ValueComputed(
            this._subscription,
            () => this._value
        );
    }
}
