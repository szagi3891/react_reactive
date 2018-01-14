//@flow

import { ValueComputed } from './ValueComputed';
import { ValueConnection } from './ValueConnection';
import { ValueSubscription } from './ValueSubscription';

export const combineValue = <A, B, R>(
    a: ValueComputed<A>,
    b: ValueComputed<B>,
    combine: ((a: A, b: B) => R)
):
    ValueComputed<R> => {

    let connection: null | {
        a: ValueConnection<A>,
        b: ValueConnection<B>
    } = null;

    const subscription = new ValueSubscription(() => {
        //gdy rozłączono wszystkich

        if (connection !== null) {
            connection.a.disconnect();
            connection.b.disconnect();
            connection = null;
        } else {
            throw Error('combineValue - Rozłączanie - Nieprawidłowe odgałęzienie');
        }
    });

    const clearCache = () => {
        //TODO - wyczyszczenie kesza
    };

    const notify = () => {
        clearCache();
        return subscription.notify();
    };

    const getValue = (): [ValueConnection<A>, ValueConnection<B>] => {
        if (connection !== null) {
            return [connection.a, connection.b];
        }

        const newConnectA = a.bind(notify);
        const newConnectB = b.bind(notify);

        connection = {
            a: newConnectA,
            b: newConnectB
        };

        return [newConnectA, newConnectB];
    };

    return new ValueComputed(
        (notify: (() => Set<() => void>)): ValueConnection<R> => {
            const disconnect = subscription.bind(notify);
            return new ValueConnection(
                () => {
                    const [connectionA, connectionB] = getValue();
                    return combine(connectionA.getValue(), connectionB.getValue())
                },
                disconnect
            );
        }
    );
};
