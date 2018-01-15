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
        subscription,
        getResult
    );
};

//TODO - scalić w jeden te dwa operatory

export const combineValueArr = <A,R>(
    arr: Array<ValueComputed<A>>,
    combine: ((arr: Array<A>) => R)
):
    ValueComputed<R> => {

    type ConnectionDataType = {
        arr: Array<ValueConnection<A>>,
        result: null | { value: R }
    };

    let connection: null | ConnectionDataType = null;

    const subscription = new ValueSubscription(() => {
        if (connection !== null) {
            for (const connectionItem of connection.arr) {
                connectionItem.disconnect();
            }
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

        const newConnectArr = arr.map(
            item => item.bind(notify)
        );

        connection = {
            arr: newConnectArr,
            result: null,
        };

        return connection;
    };

    const getResult = (): R => {
        const connection = getConnection();

        if (connection.result === null) {
            const arrArgs = connection.arr.map(connectionItem => connectionItem.getValue());
            const result = combine(arrArgs);
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
};
