//@flow
import { ValueObservable, Subject, Observable } from '../Lib/Reactive';
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
    errors$: ValueObservable<Array<string>>;
    data$: ValueObservable<Array<string>>;
                                                    //strumień z poprawnie zwalidowanymi danymi formularza
    submitData$: Observable<Array<string>>;

    send: Subject<void> = new Subject();
    send$ = this.send.asObservable();

    onSend = () => {
        this.send.next();
    }

    constructor(inputsConfig: Array<InputConfig>) {
        this.inputs = inputsConfig;

        this.errors$ = ValueObservable
            .combineLatestTupleArr(this.inputs.map(input => input.state.errorForForm$))
            .map(filterNull)
        ;

        this.data$ = ValueObservable
            .combineLatestTupleArr(this.inputs.map(input => input.state.value$))
        ;

        this.submitData$ = this.send$
            .withLatestFrom2(
                this.data$,
                this.errors$
            )
            .filter(([click, data, errors]) => errors.length === 0)
            .map(([click, data, errors]) => data);
    }
}
