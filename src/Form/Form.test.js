import FormInputState from './FormInputState';
import FormState from './FormState';
import Validators from './Validators';

const getValue = (obs) => {
    let value = null;
    let isSet = false;

    obs.subscribe((newValue) => {
        value = newValue;
        isSet = true;
    });

    if (isSet !== true) {
        throw Error('Nieprawidłowe zachowanie ValueObservable');
    }

    return value;
}

const ErrorLable1 = 'Oczekiwano poprawnej daty';
const ErrorLable2 = 'Oczekiwano poprawnego wieku';
const ErrorLable3 = 'Oczekiwano hasła do biosu';

describe('aa', () => {
    
    let formState;

    beforeEach(() => {
        formState = new FormState([{
            key: 'field1',
            label: 'Wprowadź datę bitwy pod Grunwaldem',
            state: new FormInputState(ErrorLable1, Validators.isGrunwald)
        }, {
            key: 'field2',
            label: 'Wprowadź wiek jakiśtam',
            state: new FormInputState(ErrorLable2, Validators.isNumber)
        }, {
            key: 'field3',
            label: 'Wprowadź liczbę szesnastkową',
            state: new FormInputState(ErrorLable3, Validators.isHex)
        }]);
    });

    it('check blur for input', () => {
        const input1$ = formState.inputs[0].state;
        const input2$ = formState.inputs[1].state;
        const input3$ = formState.inputs[2].state;
        
        expect(getValue(input1$.errorForInput$)).toBe(null);
        expect(getValue(input2$.errorForInput$)).toBe(null);
        expect(getValue(input3$.errorForInput$)).toBe(null);

        expect(getValue(input1$.errorForForm$)).toBe(ErrorLable1);
        expect(getValue(input2$.errorForForm$)).toBe(ErrorLable2);
        expect(getValue(input3$.errorForForm$)).toBe(ErrorLable3);

        expect(getValue(input1$.value$)).toBe('');
        expect(getValue(input2$.value$)).toBe('');
        expect(getValue(input3$.value$)).toBe('');
        expect(getValue(formState.data$)).toEqual(["", "", ""]);
        expect(getValue(formState.errors$)).toEqual([ErrorLable1, ErrorLable2, ErrorLable3]);

        input1$.onBlur();

        expect(getValue(input1$.errorForInput$)).toBe(ErrorLable1);
        expect(getValue(input2$.errorForInput$)).toBe(null);
        expect(getValue(input3$.errorForInput$)).toBe(null);

        expect(getValue(input1$.errorForForm$)).toBe(ErrorLable1);
        expect(getValue(input2$.errorForForm$)).toBe(ErrorLable2);
        expect(getValue(input3$.errorForForm$)).toBe(ErrorLable3);

        input1$.onChange({
            target: {
                value: '1322'
            }
        });

        expect(getValue(input1$.errorForInput$)).toBe(ErrorLable1);
        expect(getValue(input2$.errorForInput$)).toBe(null);
        expect(getValue(input3$.errorForInput$)).toBe(null);

        expect(getValue(input1$.errorForForm$)).toBe(ErrorLable1);
        expect(getValue(input2$.errorForForm$)).toBe(ErrorLable2);
        expect(getValue(input3$.errorForForm$)).toBe(ErrorLable3);

        expect(getValue(input1$.value$)).toBe('1322');
        expect(getValue(input2$.value$)).toBe('');
        expect(getValue(input3$.value$)).toBe('');
        expect(getValue(formState.data$)).toEqual(["1322", "", ""]);
        expect(getValue(formState.errors$)).toEqual([ErrorLable1, ErrorLable2, ErrorLable3]);
        
        input1$.onChange({
            target: {
                value: '1410'
            }
        });

        expect(getValue(input1$.errorForInput$)).toBe(null);
        expect(getValue(input2$.errorForInput$)).toBe(null);
        expect(getValue(input3$.errorForInput$)).toBe(null);

        expect(getValue(input1$.errorForForm$)).toBe(null);
        expect(getValue(input2$.errorForForm$)).toBe('Oczekiwano poprawnego wieku');
        expect(getValue(input3$.errorForForm$)).toBe('Oczekiwano hasła do biosu');

        expect(getValue(input1$.value$)).toBe('1410');
        expect(getValue(input2$.value$)).toBe('');
        expect(getValue(input3$.value$)).toBe('');
        expect(getValue(formState.data$)).toEqual(["1410", "", ""]);
        expect(getValue(formState.errors$)).toEqual([ErrorLable2, ErrorLable3]);        
    });
});