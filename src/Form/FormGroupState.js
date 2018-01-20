//@flow
import { ValueComputed } from 'computed-values';
import FormInputState from './FormInputState';

type InputConfig = {|
    key: string,
    label: string,
    state: FormInputState
|};

export default class FormGroupState {

    inputs: Array<InputConfig>;
                                                        //null - error, Array<string> - walidowalne dane
    data$: ValueComputed<Array<string> | null>;

    constructor(inputsConfig: Array<InputConfig>) {
        this.inputs = inputsConfig;

        this.data$ = ValueComputed.combineArray(this.inputs.map(input => input.state.data$), value => value)
            .map((data: Array<string | null>): Array<string> | null => {
                const out = [];

                for (const dataItem of data) {
                    if (dataItem === null) {
                        return null
                    }
                    out.push(dataItem);
                }

                return out;
            });
    }
}
