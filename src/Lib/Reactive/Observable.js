//@flow
import Rx from 'rxjs';

import { Subscription } from './Subscription';

type ObserverType<T> = {
    next: (data: T) => void,
};

type FnCreateResponseVoidType = () => void;
type FnCreateType<T> = (observer: ObserverType<T>) => (FnCreateResponseVoidType | void);

export class Observable<T> {

    _data: Rx.Observable<T>;

    constructor(fnCreate: FnCreateType<T>) {
        this._data = Rx.Observable.create((observerInner) => {
            const obs = {
                next: (data: T) => {
                    observerInner.next(data);
                }
            };

            return fnCreate(obs);
        });
    }

    static _create<K>(observer: Rx.Observable<K>): Observable<K> {
        const result = Object.create(Observable.prototype);                 //eslint-disable-line flowtype/no-weak-types
        result._data = observer;
        return result; 
    }

    distinctUntilChanged(compare?: (a: T, b: T) => bool): Observable<T> {
        const newObserver = this._data.distinctUntilChanged(compare);
        return Observable._create(newObserver);
    }

    map<K>(mapper: (value: T) => K): Observable<K> {
        const newObserver = this._data.map(mapper);
        return Observable._create(newObserver);
    }

    switchMap<K>(switchFn: (value: T) => Observable<K>): Observable<K> {
        const newObserver = this._data.switchMap((value: T) => switchFn(value)._data);
        return Observable._create(newObserver);
    }

    mergeMap<K>(mapFn: (value: T) => Observable<K>): Observable<K> {
        const newObserver = this._data.mergeMap((value: T) => mapFn(value)._data);
        return Observable._create(newObserver);
    }
    

    subscribe(onValue: (value:T) => void): Subscription {
                                                        //TODO - dorobić że sygnał onCmplete ma wyłączać subskrypcję ??
        return new Subscription(
            this._data
                .subscribe(
                    onValue,
                    (err) => {
                        console.error('Subscription Error2', err);
                    },
                    () => {
                        console.info('Complete');
                    },
                )
        );
    }

    merge<B>(b: Observable<B>): Observable<T | B> {
        const newObserver = Rx.Observable.merge(this._data, b._data);
        return Observable._create(newObserver);
    }

    mapTo<K>(value: K): Observable<K> {
        const newObserver = this._data.mapTo(value);
        return Observable._create(newObserver);
    }

    startWith(initValue: T): ValueObservable<T> {
        return ValueObservable._createFromObserver(initValue, this._data);                  //eslint-disable-line no-use-before-define
    }

    scan<S>(initState: S, reducer: (prevState: S, command: T) => S): ValueObservable<S> {
        const newObserver = this._data.scan(reducer, initState);
        return ValueObservable._createFromObserver(initState, newObserver);                 //eslint-disable-line no-use-before-define
    }

    do(doFn: (mess: T) => void): Observable<T> {
        const newObserver = this._data.do(doFn);
        return Observable._create(newObserver);
    }

    filter(filterFn: (value: T) => bool): Observable<T> {
        const newObserver = this._data.filter(filterFn);
        return Observable._create(newObserver);
    }

    withLatestFrom<B>(b: ValueObservable<B>): Observable<[T, B]> {
        const newObserver = this._data.withLatestFrom(b._data);
        return Observable._create(newObserver);
    }

    withLatestFrom2<B, C>(b: ValueObservable<B>, c: ValueObservable<C>): Observable<[T, B, C]> {
        //$FlowFixMe
        const z = this._data.withLatestFrom(b._data, c._data);
        return Observable._create(z);
    }

    withLatestFrom3<B, C, D>(b: ValueObservable<B>, c: ValueObservable<C>, d: ValueObservable<D>): Observable<[T, B, C, D]> {
        //$FlowFixMe
        const z = this._data.withLatestFrom(b._data, c._data, d._data);
        return Observable._create(z);
    }

    take(amount: number): Observable<T> {
        const newObserver = this._data.take(amount);
        return Observable._create(newObserver);
    }

    static timer(startValue: number, timeout: number): ValueObservable<number> {
        const newObserver = Rx.Observable.timer(startValue, timeout).startWith(startValue).distinctUntilChanged();
        return ValueObservable._create(newObserver);                                        //eslint-disable-line no-use-before-define
    }

    static empty<K>(): Observable<K> {
        const newObserver = Rx.Observable.empty();
        return Observable._create(newObserver);
    }

    static fromEvent<K>(target: any, event: string): Observable<K> {
        const newObserver: Rx.Observable<K> = Rx.Observable.fromEvent(target, event);
        return Observable._create(newObserver);
    }
}


export class ValueObservable<T> extends Observable<T> {

    distinctUntilChanged(compare?: (a: T, b: T) => bool): ValueObservable<T> {
        const newObserver = this._data.distinctUntilChanged(compare);
        return ValueObservable._create(newObserver);
    }

    map<K>(mapper: (value: T) => K): ValueObservable<K> {
        const newObserver = this._data.map(mapper);
        return ValueObservable._create(newObserver);
    }

    mapTo<K>(value: K): ValueObservable<K> {
        const newObserver = this._data.mapTo(value);
        return ValueObservable._create(newObserver);
    }

    switchMapValue<K>(switchFn: (value: T) => ValueObservable<K>): ValueObservable<K> {
        const newObserver = this._data.switchMap((value: T) => switchFn(value)._data);
        return ValueObservable._create(newObserver);
    }

    do(doFn: (mess: T) => void): ValueObservable<T> {
        const newObserver = this._data.do(doFn);
        return ValueObservable._create(newObserver);
    }

    take(count: number): ValueObservable<T> {
        const newObserver = this._data.take(count);
        return ValueObservable._create(newObserver);
    }

    withLatestFrom<B>(b: ValueObservable<B>): ValueObservable<[T, B]> {
        const z = this._data.withLatestFrom(b._data);
        return ValueObservable._create(z);
    }

    withLatestFrom2<B, C>(b: ValueObservable<B>, c: ValueObservable<C>): ValueObservable<[T, B, C]> {
        //$FlowFixMe
        const z = this._data.withLatestFrom(b._data, c._data);
        return ValueObservable._create(z);
    }

    withLatestFrom3<B, C, D>(b: ValueObservable<B>, c: ValueObservable<C>, d: ValueObservable<D>): ValueObservable<[T, B, C, D]> {
        //$FlowFixMe
        const z = this._data.withLatestFrom(b._data, c._data, d._data);
        return ValueObservable._create(z);
    }

    sideEffect<K>(sideEffect$: Observable<K>): ValueObservable<T> {
        //$FlowFixMe
        const newObserver = new Rx.Observable((observer) => {

            const sub1 = this._data.subscribe(
                (value) => {
                    observer.next(value);
                },
                (err) => {
                    observer.error(err);
                },
                () => {
                    observer.complete();
                }
            );

            const sub2 = sideEffect$._data.subscribe(
                () => {},
                (err) => {
                    observer.error(err);
                },
                () => {}
            );

            return () => {
                sub1.unsubscribe();
                sub2.unsubscribe();
            };
        });

        return ValueObservable._create(newObserver);
    }
    static _create<K>(observer: Rx.Observable<K>): ValueObservable<K> {
        const result = Object.create(ValueObservable.prototype);
        result._data = observer;
        return result; 
    }


    static _createFromObserver<K>(initValue: K, from: Rx.Observable<K>): ValueObservable<K> {
        const subject = new Rx.BehaviorSubject(initValue);
        from.subscribe(subject);

        //$FlowFixMe
        const inst = new Rx.Observable((observer) => {
            const sub = subject.subscribe(
                (value) => {
                    observer.next(value);
                },
                (err) => {
                    observer.error(err);
                },
                () => {
                    observer.complete();
                }
            );
            return () => {
                sub.unsubscribe();
            };
        });

        return ValueObservable._create(inst);
    }
    
    /*
    static _createFromObserver<K>(initValue: K, from: Rx.Observable<K>): ValueObservable<K> {

        //$ FlowFixMe
        const inst = new Rx.Observable((observer) => {
            observer.next(initValue);

            const sub = from.subscribe(
                (value) => {
                    observer.next(value);
                },
                (err) => {
                    observer.error(err);
                },
                () => {
                    observer.complete();
                }
            );
            return () => {
                sub.unsubscribe();
            };
        });

        return ValueObservable._create(inst);
    }
    */

    static of<K>(value: K, ...params: Array<K>): ValueObservable<K> {
        const newObserver = Rx.Observable.of(value, ...params);
        return ValueObservable._create(newObserver);
    }

    static combineLatest<A, B, Z>(
        a: ValueObservable<A>,
        b: ValueObservable<B>,
        combine: (value1: A, value2: B) => Z
    ): ValueObservable<Z> {
        const z = Rx.Observable.combineLatest(a._data, b._data, combine);
        return ValueObservable._create(z);
    }

    static combineLatestTuple<A, B>(
        a: ValueObservable<A>,
        b: ValueObservable<B>,
    ): ValueObservable<[A, B]> {
        const z = Rx.Observable.combineLatest(a._data, b._data);
        return ValueObservable._create(z);
    }

    static combineLatest3<A, B, C, Z>(
        a: ValueObservable<A>,
        b: ValueObservable<B>,
        c: ValueObservable<C>,
        combine: (value1: A, value2: B, value3: C) => Z
    ): ValueObservable<Z> {
        const z = Rx.Observable.combineLatest(a._data, b._data, c._data, combine);
        return ValueObservable._create(z);
    }

    static combineLatest4<A, B, C, D, Z>(
        a: ValueObservable<A>,
        b: ValueObservable<B>,
        c: ValueObservable<C>,
        d: ValueObservable<D>,
        combine: (value1: A, value2: B, value3: C, value4: D) => Z
    ): ValueObservable<Z> {
        const z = Rx.Observable.combineLatest(a._data, b._data, c._data, d._data, combine);
        return ValueObservable._create(z);
    }

    static combineLatest5<A, B, C, D, E, Z>(
        a: ValueObservable<A>,
        b: ValueObservable<B>,
        c: ValueObservable<C>,
        d: ValueObservable<D>,
        e: ValueObservable<E>,
        combine: (value1: A, value2: B, value3: C, value4: D, value5: E) => Z
    ): ValueObservable<Z> {
        const z = Rx.Observable.combineLatest(a._data, b._data, c._data, d._data, e._data, combine);
        return ValueObservable._create(z);
    }
}
