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

        const allToRefresh = this._subscription.notify();

        //TODO - zmienna allToRefresh będzie przekazywana do manegera tranzakcji

                                            //wywołanie wszystkich funkcji odświeżających komponenty
        for (const item of allToRefresh) {
            item();
        }
    }

    asComputed(): ValueComputed<T> {
        return new ValueComputed(
            this._subscription.buildCreatorForConnection(
                () => this._value
            )
        );
    }
}
