//@flow
import { ValueSubject, ValueObservable } from '../Lib/Reactive';

export default class FormInputState {
    value = new ValueSubject('');
    isVisit = new ValueSubject(false);

    value$ = this.value.asObservable();
    isVisit$ = this.isVisit.asObservable();

    onChange = (event: SyntheticInputEvent<>) => {
        this.value.next(event.target.value);
    }
 
    onBlur = () => {
        this.isVisit.next(true);
    }

    errorForInput$: ValueObservable<string | null>;
    errorForForm$: ValueObservable<string | null>;

    constructor(errorMessage: string, fnValidator: (value: string) => bool) {

        this.errorForForm$ = this.value$.map((input: string): null | string =>
            fnValidator(input) ? null : errorMessage
        );

        this.errorForInput$ = ValueObservable.combineLatest(
            this.errorForForm$,
            this.isVisit$,
            (error: string | null, isVisit: bool): string | null =>
                (isVisit === false) ? null : error
        );
    }
}
