//@flow

import { Value, Computed } from 'computed-values';
import FormGroupState from '../Form/FormGroupState';

export default class FormWizzardState {
    +data$: Computed<Array<Array<string>> | null>;
 
    +currentSteep$: Computed<[number, number]>;
    +currentGroup$: Computed<FormGroupState>;

    +prevEnable$: Computed<bool>;
    +nextEnable$: Computed<bool>;
    
    +_currentSteep: Value<number>;
    +_maxSteep$: Computed<number>;

    constructor(steeps: Array<FormGroupState>) {
        const listData$: Computed<Array<Array<string> | null>> = Computed.combineArray(steeps.map(steep => steep.data$), value => value);
        
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

        const nextEnable$ = Computed.combine(
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
        const steep = this._currentSteep.getValue();

        const newSteep = steep - 1;

        if (newSteep >= 0) {
            this._currentSteep.setValue(newSteep);
        }
    }

    next = () => {
        const maxSteep = this._maxSteep$.getValueSnapshot();
        const steep = this._currentSteep.getValue();

        const newSteep = steep + 1;

        if (newSteep <= maxSteep) {
            this._currentSteep.setValue(newSteep);
        }
    }
}
