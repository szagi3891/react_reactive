//@flow

import { ValueObservable, Subject, ValueSubject } from 'react_reactive_value';
import FormGroupState from '../Form/FormGroupState';
import { Observable } from 'react_reactive_value/lib/Reactive';

//TODO - do wyrzucenia
const valueFromObservable = <T>(obs: ValueObservable<T>): T => {
    let result: null | { value: T } = null;

    obs.subscribe((value) => {
        result = { value };
    });

    if (result !== null) {
        return result.value;
    }

    throw Error('AASDADADSADAS');
};

export default class FormWizzardState {
    +data$: ValueObservable<Array<Array<string>> | null>;
 
    +currentSteep$: ValueObservable<[number, number]>;
    +currentGroup$: ValueObservable<FormGroupState>;

    +prevEnable$: ValueObservable<bool>;
    +nextEnable$: ValueObservable<bool>;
    
    +_currentSteep: ValueSubject<number>;
    +_maxSteep$: ValueObservable<number>;

    constructor(steeps: Array<FormGroupState>) {
        const listData$: ValueObservable<Array<Array<string> | null>> = ValueObservable
            .combineLatestTupleArr(steeps.map(steep => steep.data$));
        
        const data$ = listData$
            .map((data: Array<Array<string> | null>): Array<Array<string>> | null => {
                const out = [];

                for (const dataItem of data) {
                    if (dataItem === null) {
                        return null
                    }
                    out.push(dataItem);
                }

                return out;
            });

        this._maxSteep$ = listData$
            .map((data: Array<Array<string> | null>) => {
                for (const [index, value] of data.entries()) {
                    if (value === null) {
                        return index;
                    }
                }

                return data.length - 1;
            });

        this._currentSteep = new ValueSubject(0);

        const steep$ = this._currentSteep.asObservable();

        const currentSteep$ = steep$.map(steep => {
            return [steep + 1, 3]
        });

        const currentGroup$ = steep$.map(steep => steeps[steep]);

        const prevEnable$ = steep$.map(steep => steep > 0);

        const nextEnable$ = ValueObservable.combineLatest(
            steep$,
            this._maxSteep$,
            (steep, maxSteep) => steep < maxSteep
        )

        this.data$ = data$;
        this.currentSteep$ = currentSteep$;
        this.currentGroup$ = currentGroup$;
        this.prevEnable$ = prevEnable$;
        this.nextEnable$ = nextEnable$;
    }

    back = () => {
        const maxSteep = valueFromObservable(this._maxSteep$);
        const steep = valueFromObservable(this._currentSteep.asObservable());

        const newSteep = steep - 1;

        if (newSteep >= 0) {
            this._currentSteep.update((value) => newSteep);
        }
    }

    next = () => {
        const maxSteep = valueFromObservable(this._maxSteep$);
        const steep = valueFromObservable(this._currentSteep.asObservable());

        const newSteep = steep + 1;

        if (newSteep <= maxSteep) {
            this._currentSteep.update((value) => newSteep);
        }
    }
}
