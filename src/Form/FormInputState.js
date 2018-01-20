//@flow
import { Value, ValueComputed } from 'computed-values';

export default class FormInputState {
    _value = new Value('');
    _isVisit = new Value(false);
                                                    //dla widoku
    value$ = this._value.asComputed();
    error$: ValueComputed<string | null>;
                                                    //dla wyższego stanu
    data$: ValueComputed<string | null>;

    constructor(errorMessage: string, fnValidator: (value: string) => bool) {

        const errorInput$ = this.value$.map((input: string): bool => !fnValidator(input));

        this.error$ = ValueComputed.combine(
            errorInput$,
            this._isVisit.asComputed(),
            (error: bool, isVisit: bool): string | null =>
                (error && isVisit) ? errorMessage : null
        );

        this.data$ = ValueComputed.combine(
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
        this._value.setValue(event.target.value);
    }
 
    onBlur = () => {
        this._isVisit.setValue(true);
    }
}
