//@flow

import { ValueConnection } from './ValueConnection';
import { mergeSet } from './Utils';

export class ValueSubscription {
    _subscription: Map<mixed, () => Set<() => void>>;

    constructor(onChangeSubscribers: (count: number) => void) {
        this._subscription = new Map();
    }

    notify(): Set<() => void> {
        const allToRefresh = [];

        for (const item of this._subscription.values()) {
            allToRefresh.push(item());
        }

        return mergeSet(...allToRefresh);
    }

    buildGetValue<T>(getValue: () => T): ((notify: () => Set<() => void>) => ValueConnection<T>) {
        return (notify: () => Set<() => void>): ValueConnection<T> => {
            const token = {};

            this._subscription.set(token, notify);

            return new ValueConnection(
                getValue,
                () => {
                    this._subscription.delete(token);
                }
            );
        };
    }
}
