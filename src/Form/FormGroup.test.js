import FormInputState from './FormInputState';
import FormGroupState from './FormGroupState';
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

const getStateInput = (inputState) => ({
    errorForInput: getValue(inputState.errorForInput$),
    errorForForm: getValue(inputState.errorForForm$),
    value: getValue(inputState.value$)
});

const getStateForm = (formState) => ({
    inputs: [
        getStateInput(formState.inputs[0].state),
        getStateInput(formState.inputs[1].state),
        getStateInput(formState.inputs[2].state)
    ],
    data: getValue(formState.data$),
    erross: getValue(formState.errors$)
});

const ErrorLable1 = 'Oczekiwano poprawnej daty';
const ErrorLable2 = 'Oczekiwano poprawnego wieku';
const ErrorLable3 = 'Oczekiwano hasła do biosu';

describe('aa', () => {
    
    let formState;

    beforeEach(() => {
        formState = new FormGroupState([{
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

        expect(getStateForm(formState)).toMatchSnapshot();

        input1$.onBlur();

        expect(getStateForm(formState)).toMatchSnapshot();

        input1$.onChange({
            target: {
                value: '1322'
            }
        });

        expect(getStateForm(formState)).toMatchSnapshot();

        input1$.onChange({
            target: {
                value: '1410'
            }
        });

        expect(getStateForm(formState)).toMatchSnapshot();        
    });
});