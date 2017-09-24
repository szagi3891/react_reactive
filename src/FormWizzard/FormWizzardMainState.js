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

const reducer = (prevSteepState: StateType, action: ActionType): StateType => {
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
};

export default class FormWizzardState {
    +_action: Subject<ActionType>;

    +data$: ValueObservable<Array<Array<string>> | null>;
 
    +currentSteep$: ValueObservable<[number, number]>;
    +currentGroup$: ValueObservable<FormGroupState>;

    +prevEnable$: ValueObservable<bool>;
    +nextEnable$: ValueObservable<bool>;
    
    constructor(
        _action: Subject<ActionType>,
        
        data$: ValueObservable<Array<Array<string>> | null>,
        
        currentSteep$: ValueObservable<[number, number]>,
        currentGroup$: ValueObservable<FormGroupState>,
    
        prevEnable$: ValueObservable<bool>,
        nextEnable$: ValueObservable<bool>
    ) {

        //$FlowFixMe
        this._action = _action;
        //$FlowFixMe
        this.data$ = data$;
        //$FlowFixMe
        this.currentSteep$ = currentSteep$;
        //$FlowFixMe
        this.currentGroup$ = currentGroup$;
        //$FlowFixMe
        this.prevEnable$ = prevEnable$;
        //$FlowFixMe
        this.nextEnable$ = nextEnable$;
    }

    static build(steeps: Array<FormGroupState>): [FormWizzardState, () => void] {
        const _action = new Subject();
        
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

        const maxSteep$ = listData$
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

        const [steep$, disconnect] = _action.asObservable()
            .merge(
                maxSteep$.map(maxSteep => ({
                    kind: 'new_max_steep',
                    max: maxSteep
                }))
            )
            .scan(initValue, reducer);

        const currentSteep$ = steep$.map(state => {
            return [state.currentSteep + 1, 3]
        });

        const currentGroup$ = steep$.map(state => {
            const { currentSteep } = state;
            return steeps[currentSteep];
        });

        const prevEnable$ = steep$.map(state =>
            state.currentSteep > 0
        );

        const nextEnable$ = steep$.map(state =>
            state.currentSteep < state.maxSteep
        );

        return [
            new FormWizzardState(
                _action,
                data$,
                currentSteep$,
                currentGroup$,
                prevEnable$,
                nextEnable$
            ),
            disconnect
        ];
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
