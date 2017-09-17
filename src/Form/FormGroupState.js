//@flow
import { ValueObservable } from '../Lib/Reactive';
import FormInputState from './FormInputState';

const filterNull = (list: Array<string | null>): Array<string> => {
    const out = [];
    for (const item of list) {
        if (item !== null) {
            out.push(item);
        }
    }
    return out;
};

type InputConfig = {|
    key: string,
    label: string,
    state: FormInputState
|};

export default class FormGroupState {

    inputs: Array<InputConfig>;
                                                        //null - error, Array<string> - walidowalne dane
    data$: ValueObservable<Array<string> | null>;

    constructor(inputsConfig: Array<InputConfig>) {
        this.inputs = inputsConfig;

        const errors$: ValueObservable<bool> = ValueObservable
            .combineLatestTupleArr(this.inputs.map(input => input.state.errorForForm$))
            .map(filterNull)
            .map(errors => errors.length > 0)
        ;

        const data$ = ValueObservable
            .combineLatestTupleArr(this.inputs.map(input => input.state.value$))
        ;

        this.data$ = ValueObservable.combineLatest(
            errors$,
            data$,
            (errors: bool, data: Array<string>): Array<string> | null => {
                if (errors) {
                    return null;
                }

                return data;
            }
        );
    }
}
