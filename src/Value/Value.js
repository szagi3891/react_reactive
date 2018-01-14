//@flow

import { ValueSubscription } from './ValueSubscription';
import { ValueComputed } from './ValueComputed';
import { transaction } from './transaction';

export class Value<T> {
    _value: T;
    _subscription: ValueSubscription;

    constructor(value: T) {
        this._value = value;
        this._subscription = new ValueSubscription(() => {});
    }

    setValue(newValue: T) {
        transaction(() => {
            this._value = newValue;
            this._subscription.notify();
        });
    }

    getValue(): T {
        return this._value;
    }

    update(fnUpdate: (old: T) => T) {
        transaction(() => {
            this._value = fnUpdate(this._value);
            this._subscription.notify();
        });
    }

    asComputed(): ValueComputed<T> {
        return new ValueComputed(
            this._subscription,
            () => this._value
        );
    }
}
