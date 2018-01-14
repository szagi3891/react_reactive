//@flow

import { ValueComputed } from '../ValueComputed';
import { ValueConnection } from '../ValueConnection';
import { ValueSubscription } from '../ValueSubscription';

export const combineValue = <A, B, R>(
    a: ValueComputed<A>,
    b: ValueComputed<B>,
    combine: ((a: A, b: B) => R)
):
    ValueComputed<R> => {

    type ConnectionDataType = {
        a: ValueConnection<A>,
        b: ValueConnection<B>,
        result: null | { value: R }
    };

    let connection: null | ConnectionDataType = null;

    const subscription = new ValueSubscription(() => {
        if (connection !== null) {
            connection.a.disconnect();
            connection.b.disconnect();
            connection = null;
        } else {
            throw Error('combineValue - disconnect - Incorrect code branch');
        }
    });

    const clearCache = () => {
        if (connection) {
            connection.result = null;
        } else {
            throw Error('combineValue - clearCache - Incorrect code branch')
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

        const newConnectA = a.bind(notify);
        const newConnectB = b.bind(notify);

        connection = {
            a: newConnectA,
            b: newConnectB,
            result: null,
        };

        return connection;
    };

    const getResult = (): R => {
        const connection = getConnection();

        if (connection.result === null) {
            const result = combine(connection.a.getValue(), connection.b.getValue());
            connection.result = { value: result };
            return result;
        } else {
            return connection.result.value;
        }
    };

    return new ValueComputed(
        (notify: (() => Set<() => void>)): ValueConnection<R> => {
            const disconnect = subscription.bind(notify);
            return new ValueConnection(
                getResult,
                disconnect
            );
        }
    );
};
