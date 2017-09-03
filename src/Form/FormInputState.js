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

        const data$ = ValueObservable.combineLatestTuple(
            this.value$,
            this.isVisit$
        );

        this.errorForInput$ = data$.map(([input, isVisit]: [string, bool]): null | string => {
            if (isVisit === false) {
                return null;
            }

            if (!fnValidator(input)) {
                return errorMessage;
            }

            return null;
        });

        this.errorForForm$ = data$.map(([input, isVisit]: [string, bool]): null | string =>
            fnValidator(input) ? null : errorMessage
        );
    }
}
