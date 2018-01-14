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

    const subscription = new ValueSubscription(() => {
        //gdy rozłączono wszystkich
    });

    let connection: null | {
        a: ValueConnection<A>,
        b: ValueConnection<B>
    } = null;

    /*
    bindNotify(notify: () => Set<() => void>): () => void {


        ta funkcja będzie posiadałą obiekt ValueSubscriptions

        będzie jednocześnie się łączył do dwóch parentów


        wynikowy ValueComputad będzie pokazywał na tą powyższą subskrypcję
    */



    let connectionA: null | ValueConnection<A> = null;
    let connectionB: null | ValueConnection<B> = null;

    const getValueA = (): ValueConnection<A> => {
        if (connectionA !== null) {
            return connectionA;
        }

        const newItem = a.connect(null);
        connectionA = newItem;
        return newItem;
    };

    const getValueB = (): ValueConnection<B> => {
        if (connectionB !== null) {
            return connectionB;
        }

        const newItem = b.connect(null);
        connectionB = newItem;
        return newItem;
    };


    /*
    return ValueComputed.create(
        (subscription) => {
            this._subscription.buildGetValue(
                //gdy to jest wywołane, tworzona jest wartość
                () => combine(getValueA().getValue(), getValueB().getValue())
            )
        }
    )
    */

    return new ValueComputed(
        //(): ValueConnection<R> => {
            //podłącz się na parentaA i parentaB
        //}
        (notify: (() => Set<() => void>)): ValueConnection<R> => {
            const disconnect = subscription.bind(notify);
            return new ValueConnection(
                () => combine(getValueA().getValue(), getValueB().getValue()),
                disconnect
            );
        }
    );
};
