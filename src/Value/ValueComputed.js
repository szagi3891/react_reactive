//@flow

import { ValueSubscription } from './ValueSubscription';
import type { AddParamType } from './ValueSubscription';
import { ValueConnection } from './ValueConnection';

export class ValueComputed<T> {
    _subscription: ValueSubscription;

    _getParentConnection: (param: AddParamType) => ValueConnection<T>;

    _cache: null | {
        connection: ValueConnection<T>,
        value: null | { value: T }
    };

    constructor(getParentConnection: (param: AddParamType) => ValueConnection<T>) {
        this._getParentConnection = getParentConnection;
        this._cache = null;

        this._subscription = new ValueSubscription((subscribersCount: number) => {
            if (subscribersCount === 0 && this._cache !== null) {
                this._cache.connection.disconnect();
                this._cache = null;
            }
        });
    }

    _clearCache() {
        if (this._cache) {
            this._cache.value = null;
        }
    }

    _getParentValueConnection(): ValueConnection<T> {
        const cache = this._cache;

        if (cache) {
            return cache.connection;
        }

        const valueConnection = this._getParentConnection({
            hot: false,
            notify: () => {
                this._clearCache();
                return this._subscription.notify();
            },
            onRefresh: null
        });

        this._cache = {
            connection: valueConnection,
            value: null
        };

        return valueConnection;
    }

    _getValue(): T {
        if (this._cache !== null && this._cache.value !== null) {
            return this._cache.value.value;
        }

        const value: T = this._getParentValueConnection().getValue();

        if (this._subscription.hasShouldCache()) {
            if (this._cache) {
                if (this._cache.value === null) {
                    this._cache.value = {
                        value: value
                    };
                }
            } else {
                throw Error('Nieprawidłowe odgałęzienie programu');
            }
        }

        return value;
    }

    map<M>(mapFun: (value: T) => M): ValueComputed<M> {
       return new ValueComputed(
            this._subscription.buildCreatorForConnection(
                () => mapFun(this._getValue())
            )
        );
    }

    connect(onRefresh: (() => void) | null): ValueConnection<T> {
        return this._subscription.bind(
            () => this._getValue(),
            onRefresh
        );
    }

    /*
    connectMore() {

    }
    */

    //buildCreatorForConnection<T>(getValue: () => T): ((param: AddParamType) => ValueConnection<T>) {
}

