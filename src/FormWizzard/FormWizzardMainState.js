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
    steep1: FormGroupState;
    steep2: FormGroupState;
    steep3: FormGroupState;

    _action: Subject<ActionType>;

    data$: ValueObservable<Array<Array<string>> | null>;
    steep$: ValueObservable<StateType>;
 
    currentSteep$: ValueObservable<[number, number]>;
    currentGroup$: ValueObservable<FormGroupState>;

    prevEnable$: ValueObservable<bool>;
    nextEnable$: ValueObservable<bool>;
    
    constructor(steep1: FormGroupState, steep2: FormGroupState, steep3: FormGroupState) {
        this.steep1 = steep1;
        this.steep2 = steep2;
        this.steep3 = steep3;

        this._action = new Subject();

        this.data$ = ValueObservable.combineLatest3(
            steep1.data$,
            steep2.data$,
            steep3.data$,
            (data1, data2, data3) => {
                if (data1 === null || data2 === null || data3 === null) {
                    return null;
                }

                return [data1, data2, data3];
            }
        );

        const maxSteep$ = ValueObservable.combineLatest3(
            steep1.data$,
            steep2.data$,
            steep3.data$,
            (data1, data2, data3) => {
                if (data1 === null) {
                    return 0;
                }
                if (data2 === null) {
                    return 1;
                }
                return 2;
            }
        );
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
            if (state.currentSteep === 0) {
                return steep1;
            }

            if (state.currentSteep === 1) {
                return steep2;
            }

            return steep3;
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
