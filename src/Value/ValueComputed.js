//@flow

import { ValueSubscription } from './ValueSubscription';
import { ValueConnection } from './ValueConnection';
import { pushToRefresh } from './transaction';
import { Value } from './Value';

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
            subscription.notify();
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
            subscription,
            getResult
        );
    }

    switch<K>(swithFunc: ((value: T) => ValueComputed<K>)): ValueComputed<K> {
        type ConnectionDataType = {
            self: ValueConnection<T>,
            target: ValueConnection<K>,
        };

        let connection: null | ConnectionDataType = null;

        const clearConnection = () => {
            if (connection !== null) {
                connection.self.disconnect();
                connection.target.disconnect();
                connection = null;
            } else {
                throw Error('Switch - disconnect - Incorrect code branch');
            }
        };

        const subscription = new ValueSubscription(clearConnection);

        const getTargetBySelf = (self: ValueConnection<T>): ValueConnection<K> => {
            const targetComputed = swithFunc(self.getValue());
            return targetComputed.bind(() => {
                subscription.notify();
            });
        };

        const notify = () => {
            if (connection !== null) {
                const newTarget = getTargetBySelf(connection.self);
                connection.target.disconnect();
                connection.target = newTarget;
            } else {
                throw Error('Switch - notify - Incorrect code branch');
            }

            subscription.notify();
        };

        const getNewConnection = (): ConnectionDataType => {
            const self = this.bind(notify);

            return {
                self,
                target: getTargetBySelf(self)
            };
        };

        const getConnection = (): ConnectionDataType => {
            if (connection !== null) {
                return connection;
            }

            const newConnect = getNewConnection();
            connection = newConnect;
            return connection;
        };

        const getResult = (): K => {
            const connection = getConnection();
            return connection.target.getValue();
        };

        return new ValueComputed(
            subscription,
            getResult
        );
    }

    /*
    debounceTime(time: number): ValueComputed<T> {
        type ConnectionDataType = {
            connection: null | ValueConnection<T>,
            timer: number,
        };

        let connection: null | ValueConnection<T> = null;

        const subscription = new ValueSubscription(() => {
            if (connection !== null) {
                connection.disconnect();
                connection = null;
            } else {
                throw Error('debounceTime - disconnect - Incorrect code branch');
            }
        });

        const getValue = (): T => {
            //...
            return this._getValue();
        };

        const out = new Value();
        out._subscription = subscription;

        //...

        return out.asComputed();
    }
    */

    /*
    distinctUntilChanged(): ValueComputed<T> {
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

