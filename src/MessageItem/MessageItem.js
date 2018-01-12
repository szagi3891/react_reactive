//@flow
import * as React from 'react';
import { BaseComponent, ValueSubject, Subscription } from 'react_reactive_value';

type ParentType<T> = {
    getValue: () => T;
};


class ValueConnection<T> {
    _connect: bool;
    _getValue: () => T;
    _disconnect: () => void;

    constructor(getValue: () => T, disconnect: () => void) {
        this._connect = true;
        this._getValue = getValue;
        this._disconnect = disconnect;
    }

    disconnect() {
        this._connect = true;
        this._disconnect();
    }

    getValue = (): T => {
        if (this._connect) {
            return this._getValue();
        }

        throw Error('Połączenie jest rozłączone');
    }
}

type AddParamType = {
    hot: bool,
    notify: () => Array<() => void>,
    onRefresh: (() => void) | null,
    onClearCache: () => void
};

class ValueSubscription {
    _subscription: Map<mixed, {
        hot: bool,
        notify: () => Array<() => void>,
        onRefresh: (() => void) | null,
        onClearCache: () => void,
    }>;

    constructor(onChangeSubscribers: (count: number) => void) {
        this._subscription = new Map();
    }

    notify(): Array<() => void> {
        const allToRefresh = [];

        for (const item of this._subscription.values()) {
            item.onClearCache();

            if (item.onRefresh !== null) {
                allToRefresh.push(item.onRefresh);
            }

            const result = item.notify();
            allToRefresh.push(...result);
        }

        //TODO - Tutaj przeprowadzić trzeba deduplikację zmiennej allToRefresh

        return allToRefresh;
    }

    buildCreatorFunctionForValueConnection<T>(getValue: () => T): ((param: AddParamType) => ValueConnection<T>) {
        return (param: AddParamType): ValueConnection<T> => {
            const token = {};

            this._subscription.set(token, {
                hot: param.hot,
                notify: param.notify,
                onRefresh: param.onRefresh,
                onClearCache: param.onClearCache
            });

            return new ValueConnection(
                getValue,
                () => {
                    this._subscription.delete(token);
                }
            );
        };
    }

    shoudCache(): bool {
        if (this._subscription.size > 1) {
            return true;
        }

        if (this._subscription.size === 1) {
            for (const item of this._subscription.values()) {
                return item.hot;
            }
        }

        return false;
    }
}

class Value<T> {
    _value: T;
    _subscription: ValueSubscription;

    constructor(value: T) {
        this._value = value;
        this._subscription = new ValueSubscription(() => {});
    }

    setValue(newValue: T) {
        this._value = newValue;

        const allToRefresh = this._subscription.notify();

                                            //wywołanie wszystkich funkcji odświeżających komponenty
        for (const item of allToRefresh) {
            item();
        }
    }

    asComputed(): ValueComputed<T> {
        return new ValueComputed(
            this._subscription.buildCreatorFunctionForValueConnection(() => this._value)
        );
    }
}

class ValueComputed<T> {
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

    _getParentValueConnection(): ValueConnection<T> {
        const cache = this._cache;

        if (cache) {
            return cache.connection;
        }

        const valueConnection = this._getParentConnection({
            hot: false,
            notify: () => {
                //TODO - Jedź po dzieciach subskrypcji i powiadamiaj kolejno
                return [];
            },
            onRefresh: null,
            onClearCache: () => {
                //TODO - wyczyść kesz
            }
        });

        this._cache = {
            connection: valueConnection,
            value: null
        };

        return valueConnection;
    }

    map<M>(mapFun: (value: T) => M): ValueComputed<M> {
        const getValue = (): M => {
            const value = this._getParentValueConnection().getValue();

            if (this._subscription.shoudCache()) {
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

            return mapFun(value);
        };

        return new ValueComputed(
            this._subscription.buildCreatorFunctionForValueConnection(getValue)
        );
    }
}


/*
const counter8 = new Value(44);

const counter9 = counter8.asComputed().map(value => value + 1);

const counter10 = counter9.map(value => `dsadsa ${value}`);

//newC.getValue() --> pobiera wartość wyliczoną
//   //potrzebne do ustalania kesza

const connection = counter10.connect();

const vvv = connection.getValue();

console.info('value ==>', vvv);

//rozłączenie połączenia
//connection.disconnect();
*/


/*
    nadpisac render
    getValue(value)
*/


const counter = new ValueSubject(44);
const counter2 = new ValueSubject(1);

setInterval(() => {
//    counter.update(prevValue => prevValue + 1);
    counter.update(prevValue => {
        counter2.update(prevValue => prevValue);
        return prevValue + 1;
    });
}, 2000);

setInterval(() => {
    counter2.update(prevValue => prevValue + 1);
}, 3000);

type PropsType = {|
    className: string,
    messageId: string,
|};

export default class MessageItem extends BaseComponent<PropsType> {

    counter$ = counter.asObservable();
    char$ = counter2.asObservable()
        .map(count => '.'.repeat(Math.min(count, 30)));

    render() {
        const { className, messageId } = this.props;
        const counter = this.getValue$(this.counter$);
        const char = this.getValue$(this.char$);

        return (
            <div className={className}>
                <p>{ messageId } { counter }</p>
                <p>{char}</p>
            </div>
        );
    }
}

/*
const counter = new ValueSubject(44);
const counter2 = new ValueSubject(1);

setInterval(() => {
//    counter.update(prevValue => prevValue + 1);
    counter.update(prevValue => {
        counter2.update(prevValue => prevValue);
        return prevValue + 1;
    });
}, 2000);

setInterval(() => {
    counter2.update(prevValue => prevValue + 1);
}, 3000);

type PropsType = {|
    className: string,
    messageId: string,
|};

export default class MessageItem extends BaseComponent<PropsType> {

    counter$ = counter.asObservable();
    char$ = counter2.asObservable()
        .map(count => '.'.repeat(Math.min(count, 30)));

    render() {
        const { className, messageId } = this.props;
        const counter = this.getValue$(this.counter$);
        const char = this.getValue$(this.char$);

        return (
            <div className={className}>
                <p>{ messageId } { counter }</p>
                <p>{char}</p>
            </div>
        );
    }
}
*/