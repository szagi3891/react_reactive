//@flow

import { Value, ValueComputed, combineValueArr, combineValue } from '../Value';
import FormGroupState from '../Form/FormGroupState';

const getValue = <T>(data: ValueComputed<T>): T => {
    const connection = data.bind(() => {});
    const value = connection.getValue();
    connection.disconnect();
    return value;
};

export default class FormWizzardState {
    +data$: ValueComputed<Array<Array<string>> | null>;
 
    +currentSteep$: ValueComputed<[number, number]>;
    +currentGroup$: ValueComputed<FormGroupState>;

    +prevEnable$: ValueComputed<bool>;
    +nextEnable$: ValueComputed<bool>;
    
    +_currentSteep: Value<number>;
    +_maxSteep$: ValueComputed<number>;

    constructor(steeps: Array<FormGroupState>) {
        const listData$: ValueComputed<Array<Array<string> | null>> = combineValueArr(steeps.map(steep => steep.data$), value => value);
        
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

        this._currentSteep = new Value(0);

        const steep$ = this._currentSteep.asComputed();

        const currentSteep$ = steep$.map(steep => {
            return [steep + 1, 3]
        });

        const currentGroup$ = steep$.map(steep => steeps[steep]);

        const prevEnable$ = steep$.map(steep => steep > 0);

        const nextEnable$ = combineValue(
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
        const maxSteep = getValue(this._maxSteep$);
        const steep = this._currentSteep.getValue();

        const newSteep = steep - 1;

        if (newSteep >= 0) {
            this._currentSteep.update((value) => newSteep);
        }
    }

    next = () => {
        const maxSteep = getValue(this._maxSteep$);
        const steep = this._currentSteep.getValue();

        const newSteep = steep + 1;

        if (newSteep <= maxSteep) {
            this._currentSteep.update((value) => newSteep);
        }
    }
}
