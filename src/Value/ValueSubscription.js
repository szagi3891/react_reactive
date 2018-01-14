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

    bindNotify(notify: () => Set<() => void>): () => void {
        const token = {};

        this._subscription.set(token, notify);

        return () => {
            this._subscription.delete(token);
        }
    }

    /*
    bind<T>(
        getValue: () => T,
        notify: () => Set<() => void>
    ): ValueConnection<T> {
        const disconnect = this.bindNotify(notify);
        return new ValueConnection(getValue, disconnect); 
    }
    */

    buildGetValue<T>(getValue: () => T): ((notify: () => Set<() => void>) => ValueConnection<T>) {
        return (notify: () => Set<() => void>): ValueConnection<T> => {

            const disconnect = this.bindNotify(notify);
            return new ValueConnection(getValue, disconnect);

            /*
            const token = {};

            this._subscription.set(token, notify);

            return new ValueConnection(
                getValue,
                () => {
                    this._subscription.delete(token);
                }
            );
            */
        };
    }
}
