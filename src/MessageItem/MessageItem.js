//@flow
import * as React from 'react';
import { BaseComponent, ValueSubject } from 'react_reactive_value';

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

type AddParamType = {|
    hot: bool,
    notify: () => Set<() => void>,
    onRefresh: (() => void) | null
|};

class ValueSubscription {
    _subscription: Map<mixed, AddParamType>;

    constructor(onChangeSubscribers: (count: number) => void) {
        this._subscription = new Map();
    }

    notify(): Set<() => void> {
        const allToRefresh = new Set();

        for (const item of this._subscription.values()) {
            if (item.onRefresh !== null) {
                allToRefresh.add(item.onRefresh);
            }

            const result = item.notify();
            for (const item of result) {
                allToRefresh.add(item);
            }
        }

        return allToRefresh;
    }

    buildCreatorForConnection<T>(getValue: () => T): ((param: AddParamType) => ValueConnection<T>) {
        return (param: AddParamType): ValueConnection<T> => {
            const token = {};

            this._subscription.set(token, {
                hot: param.hot,
                notify: param.notify,
                onRefresh: param.onRefresh,
            });

            return new ValueConnection(
                getValue,
                () => {
                    this._subscription.delete(token);
                }
            );
        };
    }

    bind<T>(getValue: () => T, onRefresh: (() => void) | null): ValueConnection<T> {
        const token = {};

        this._subscription.set(token, {
            hot: false,
            notify: () => new Set(),
            onRefresh: onRefresh,
        });

        return new ValueConnection(
            getValue,
            () => {
                this._subscription.delete(token);
            }
        );
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
}



const counter8 = new Value(44);

const counter9 = counter8.asComputed().map(value => value + 1);

const counter10 = counter9.map(value => `dsadsa ${value}`);

const connection = counter10.connect(() => {
    console.info('TRZEBA ODŚWIEŻYĆ WIDOK');
});

console.info('value ==>', connection.getValue());

counter8.setValue(334444);

console.info('value ==>', connection.getValue());

counter8.setValue(6);


console.info('value ==>', connection.getValue());

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