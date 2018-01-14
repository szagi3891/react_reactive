//@flow

import { ValueSubscription } from './ValueSubscription';
import { ValueConnection } from './ValueConnection';
import { pushToRefresh } from './transaction';

export class ValueComputed<T> {
    _subscription: ValueSubscription;
    _getValue: () => T;

    constructor(subscription: ValueSubscription, getValue: () => T) {
        this._subscription = subscription;
        this._getValue = getValue;
    }

    map<M>(mapFun: (value: T) => M): ValueComputed<M> {
        type ConnectionDataType = {
            parent: ValueConnection<T>,
            result: null | { value: M }
        };

        let connection: null | ConnectionDataType = null;

        const subscription = new ValueSubscription(() => {
            if (connection !== null) {
                connection.parent.disconnect();
                connection = null;
            } else {
                throw Error('Map - disconnect - Incorrect code branch');
            }
        });

        const clearCache = () => {
            if (connection) {
                connection.result = null;
            } else {
                throw Error('Map - clearCache - Incorrect code branch')
            }
        };

        const notify = () => {
            clearCache();
            return subscription.notify();
        };

        const getConnection = (): ConnectionDataType => {
            if (connection !== null) {
                return connection;
            }

            const newConnect = this.bind(notify);

            connection = {
                parent: newConnect,
                result: null
            };

            return connection;
        };

        const getResult = (): M => {
            const connection = getConnection();

            if (connection.result === null) {
                const result = mapFun(this._getValue());
                connection.result = { value: result };
                return result;
            } else {
                return connection.result.value;
            }
        };

        return new ValueComputed(
            this._subscription,
            getResult
        );
    }

/*
    switch(swithFunc: ((value: T) => ValueComputed<K>)): ValueComputed<K> => {

    }
*/

    bind(notify: () => void): ValueConnection<T> {
        const disconnect = this._subscription.bind(notify);
        return new ValueConnection(
            () => this._getValue(),
            disconnect
        );
    }

    connect(onRefresh: (() => void) | null): ValueConnection<T> {
        const disconnect = this._subscription.bind(
            () => {
                if (onRefresh) {
                    pushToRefresh(onRefresh);
                }
            }
        );

        return new ValueConnection(
            () => this._getValue(),
            disconnect
        );
    }
}

