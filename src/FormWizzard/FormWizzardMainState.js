//@flow

import { ValueObservable, Subject } from 'react_reactive_value';
import FormGroupState from '../Form/FormGroupState';

type ActionType = {|
    kind: 'back'
|} | {|
    kind: 'next'
|} | {|
    kind: 'new_max_steep',
    max: number
|};

type StateType = {|
    currentSteep: number,
    maxSteep: number,
|};

export default class FormWizzardState {
    _action: Subject<ActionType>;

    data$: ValueObservable<Array<Array<string>> | null>;
    steep$: ValueObservable<StateType>;
 
    currentSteep$: ValueObservable<[number, number]>;
    currentGroup$: ValueObservable<FormGroupState>;

    prevEnable$: ValueObservable<bool>;
    nextEnable$: ValueObservable<bool>;
    
    constructor(steeps: Array<FormGroupState>) {
        this._action = new Subject();

        this.data$ = ValueObservable
            .combineLatestTupleArr(steeps.map(steep => steep.data$))
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

        const maxSteep$ = ValueObservable
            .combineLatestTupleArr(steeps.map(steep => steep.data$))
            .map((data: Array<Array<string> | null>) => {
                for (const [index, value] of data.entries()) {
                    if (value === null) {
                        return index;
                    }
                }

                return data.length - 1;
            });

        const initValue = {
            currentSteep: 0,
            maxSteep: 0
        };

        this.steep$ = this._action.asObservable()
            .merge(
                maxSteep$.map(maxSteep => ({
                    kind: 'new_max_steep',
                    max: maxSteep
                }))
            )
            .scan(initValue, (prevSteepState, action) => {
                if (action.kind === 'back') {
                    const newCurrentSteep = prevSteepState.currentSteep - 1;

                    if (newCurrentSteep >= 0) {
                        return {
                            currentSteep: newCurrentSteep,
                            maxSteep: prevSteepState.maxSteep
                        };
                    }

                    return prevSteepState;
                }

                if (action.kind === 'next') {
                    const newCurrentSteep = prevSteepState.currentSteep + 1;
                    
                    if (newCurrentSteep <= prevSteepState.maxSteep) {
                        return {
                            currentSteep: newCurrentSteep,
                            maxSteep: prevSteepState.maxSteep
                        };
                    }

                    return prevSteepState;
                }

                if (action.kind === 'new_max_steep') {
                    return {
                        currentSteep: Math.min(prevSteepState.currentSteep, action.max),
                        maxSteep: action.max
                    };
                }

                return prevSteepState;
            });
        
        this.currentSteep$ = this.steep$.map(state => {
            return [state.currentSteep + 1, 3]
        });

        this.currentGroup$ = this.steep$.map(state => {
            const { currentSteep } = state;
            return steeps[currentSteep];
        });

        this.prevEnable$ = this.steep$.map(state =>
            state.currentSteep > 0
        );

        this.nextEnable$ = this.steep$.map(state =>
            state.currentSteep < state.maxSteep
        );
    }

    back = () => {
        this._action.next({
            kind: 'back'
        });
    }

    next = () => {
        this._action.next({
            kind: 'next'
        });
    }
}
