//@flow
import { ValueSubject, ValueObservable } from 'react_reactive_value';

export default class FormInputState {
    _value = new ValueSubject('');
    _isVisit = new ValueSubject(false);
                                                    //dla widoku
    value$ = this._value.asObservable();
    error$: ValueObservable<string | null>;
                                                    //dla wyższego stanu
    data$: ValueObservable<string | null>;

    constructor(errorMessage: string, fnValidator: (value: string) => bool) {

        const errorInput$ = this.value$.map((input: string): bool => !fnValidator(input));

        this.error$ = ValueObservable.combineLatest(
            errorInput$,
            this._isVisit.asObservable(),
            (error: bool, isVisit: bool): string | null =>
                (error && isVisit) ? errorMessage : null
        );

        this.data$ = ValueObservable.combineLatest(
            errorInput$,
            this.value$,
            (error: bool, value: string): string | null => {
                if (error) {
                    return null;
                }

                return value;
            }
        )
    }

    onChange = (event: SyntheticInputEvent<>) => {
        this._value.next(event.target.value);
    }
 
    onBlur = () => {
        this._isVisit.next(true);
    }
}
