//@flow
import * as React from 'react';
import { BaseComponent, ValueSubject } from 'react_reactive_value';

type ParentType<T> = {
    getValue: () => T;
};

class Value<T> {
    _value: T;

    _connectSubscription: Array<() => Array<() => void>>;

    constructor(value: T) {
        this._value = value;
    }

    setValue(newValue: T) {
        this._value = newValue;

        const allToRefresh = [];

                                                //powiadom wszystkich przyłączonych że muszą oczyścić kesze ...

        for (const itemNotify of this._connectSubscription) {
            const result = itemNotify();
            allToRefresh.push(...result);
        }

        //Tutaj przeprowadzić trzeba deduplikację zmiennej allToRefresh

        for (const item of allToRefresh) {
            item();                             //wywołujemy funkcję odświeżającą nod-a
        }
    }

    getValue(): T {
        return this._value;
    }

    asComputed(): ValueComputed<T, T> {
        return new ValueComputed(() => this.getValue(), (value) => value);
    }

    connect(toNotify: () => Array<() => void>): () => void {

        return () => {
            //następuje odłączenie
        };

        /*
            //a może tak ...
        return {    
            disconect: () => {},                //disconnect(self)
            getValue() => {                     //getValue(&self)

            }
        }
        */
    }
}

class ValueComputed<T, K> {
    _parent: () => T;
    _mapFun: (value: T) => K;
    _cache: null | { value: K };

    _subscrition: Map<mixed, () => void>;

    //_subHot: Set<>;

    constructor(parent: () => T, mapFun: (value: T) => K) {
        this._parent = parent;
        this._mapFun = mapFun;
        this._cache = null;

        this._subscrition = new Map();
    }

    //_getValue(): K {}

    getValue(): K {
        const cache = this._cache;

        if (cache === null) {
            const value = this._mapFun(this._parent.getValue());

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
        return new ValueComputed(() => this.getValue(), mapFun);
    }

    subscribe(funSub: () => void): () => void {                 //argumentem jest funkcja która będzie wywołana w razie konieczności odświeżenia
                                                                //komponent będzie miał współdzielonego callbacka który będzie odpalany w przypadku odświeżenia
                                                                //jeśli będzie kilka subskrypcji z komponentu, to zostaną one spłaszczone w jednego callbacka Set<() => void>
                                                                //duplikaty zostaną usunięte
        const token = {};

        this._subscrition.set(token, funSub);

        return () => {
            this._subscrition.delete(token);    
        };
    }

    connect(): () => void {

        //parent.connect()

        return () => {
        };
    }


    /*
    connectHot(): () => void {

        return () => {

        };
    }
    */
}

const counter8 = new Value(44);

const counter9 = counter8.asComputed().map(value => value + 1);

const counter10 = counter9.map(value => `dsadsa ${value}`);

//newC.getValue() --> pobiera wartość wyliczoną
//   //potrzebne do ustalania kesza

const unconnect = counter10.connect();

const vvv = counter10.getValue();

console.info('value ==>', vvv);


/*
const ValueComputed = <T, K>(
    parent: ParentType<T>,
    mapFunc: (value: T) => K
): ParentType<K> => {

    const getValue = (): K => mapFunc(parent.getValue());

    return {
        getValue
    };
};
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