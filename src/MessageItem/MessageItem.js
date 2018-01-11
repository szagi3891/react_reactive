//@flow
import * as React from 'react';
import { BaseComponent, ValueSubject, Subscription } from 'react_reactive_value';

type ParentType<T> = {
    getValue: () => T;
};

type NotifyFunctionType = () => Array<() => void>;
type RefreshFunctionType = () => void;

class ValueConnection<T> {
    _getValue: () => T;
    _disconnect: () => void;

    constructor(getValue: () => T, disconnect: () => void) {
        this._getValue = getValue;
        this._disconnect = disconnect;
    }

    disconnect() {
        this._disconnect();
    }

    getValue(): T {
        return this._getValue();
    }
}

class ValueSubscription<T> {
    _getValue: () => T;

    _subscription: Map<mixed, {
        hot: bool,
        notify: () => Array<() => void>,
        subscribe: RefreshFunctionType | null,
        onClearCache: () => void,
    }>;

    constructor(getValue: () => T) {
        this._getValue = getValue;
        this._subscription = new Map();
    }

    notify(): Array<() => void> {
        const allToRefresh = [];

        for (const item of this._subscription.values()) {
            item.onClearCache();

            if (item.subscribe !== null) {
                allToRefresh.push(item.subscribe);
            }

            const result = item.notify();
            allToRefresh.push(...result);
        }

        //TODO - Tutaj przeprowadzić trzeba deduplikację zmiennej allToRefresh

        return allToRefresh;
    }

    add(hot: bool, notifyFunc: () => Array<() => void>, subscribe: RefreshFunctionType | null, onClearCache: () => void): ValueConnection<T> {
        const token = {};

        this._subscription.set(token, {
            hot,
            notify: notifyFunc,
            subscribe,
            onClearCache
        });

        return new ValueConnection(this._getValue, () => {
            this._subscription.delete(token);
        });
    }
}

class Value<T> {
    _value: T;
    _subscription: ValueSubscription<T>;

    constructor(value: T) {
        this._value = value;
        this._subscription = new ValueSubscription(() => this._value);
    }

    setValue(newValue: T) {
        this._value = newValue;

        const allToRefresh = this._subscription.notify();

                                            //wywołanie wszystkich funkcji odświeżających komponenty
        for (const item of allToRefresh) {
            item();
        }
    }

    asComputed(): ValueComputed<T, T> {
        return new ValueComputed(
            () => this._value,
            (value) => value
        );
    }

    connect(hot: bool, notifyFunc: NotifyFunctionType, subscribe: RefreshFunctionType | null): ValueConnection<T> {
        return this._subscription.add(hot, notifyFunc, subscribe, () => {
            //W tym miejscu czyścimy lokalny kesz ...
            //Dla tego typu nic nie robimy ponieważ ten węzeł nie posiada kesza
        });
    }
}

class ValueComputed<T, K> {
    _getParentValue: () => T;
    _mapFun: (value: T) => K;
    _cache: null | { value: K };

    _subscription: ValueSubscription<K>;

    constructor(getParentValue: () => T, mapFun: (value: T) => K) {
        this._getParentValue = getParentValue;
        this._mapFun = mapFun;
        this._cache = null;

        this._subscription = new ValueSubscription(() => this._getValue());
    }

    _getValue(): K {
        const cache = this._cache;

        if (cache === null) {
            const value = this._mapFun(this._getParentValue());

            this._cache = {
                value
            };

            /*
                jeśli powinniśmy keszować, to wypełnij ten kesz ...

                warunek na niekeszowanie:
                _subscrition.length == 0
                connect 0 lub 1
                connectHot 0

                w pozostałych przypadkach keszuj
            */

            return value;
        }

        return cache.value;
    }

    map<M>(mapFun: (value: K) => M): ValueComputed<K, M> {
        return new ValueComputed(() => this._getValue(), mapFun);
    }

    connect(hot: bool, notifyFunc: NotifyFunctionType, subscribe: RefreshFunctionType | null): ValueConnection<T> {
        return this._subscription.add(hot, notifyFunc, subscribe, () => {
            //W tym miejscu czyścimy lokalny kesz ...
            //Dla tego typu nic nie robimy ponieważ ten węzeł nie posiada kesza
        });
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