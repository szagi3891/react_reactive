//@flow
import * as React from 'react';
import {observable, computed, action} from 'mobx';
import {observer} from 'mobx-react';
//import DevTools from 'mobx-react-devtools'

const minChars = (minCharsLen: number) => (data: string): string| null => {
    if (data.length < minCharsLen) {
        return `Oczekiwano przynajmniej ${minCharsLen} znaków`;
    }
    return null;
};

const numbers = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);

const onlyNumbers = (data: string): string | null => {
    const maxLen = data.length;

    for (let i=0; i<maxLen; i++) {
        if (numbers.has(data[i]) === false) {
            return 'Oczekiwano liczby';
        }
    }

    return null;
};

class InputState {
    +label: string = "";
    +validator: ((data: string) => null | string);
    @observable value: string = "";
    @observable hasVisited: bool = false;

    @computed get isValid(): bool {
        return this.validator(this.value) === null;
    }

    @computed get error(): string | null {
        if (this.hasVisited) {
            return this.validator(this.value);
        }

        return null;
    }

    constructor(label: string, validator: ((data: string) => null | string)) {
        this.label = label;
        this.validator = validator;
    }

    @action setValue(newValue: string) {
        this.value = newValue;
    }

    @action setBlur() {
        this.hasVisited = true;
    }
}

class FormState {
    field1: InputState;
    field2: InputState;
    field3: InputState;

    @computed get isValid(): bool {
        return this.field1.isValid
            && this.field2.isValid
            && this.field3.isValid
        ;
    }

    constructor(input1: InputState, input2: InputState, input3: InputState) {
        this.field1 = input1;
        this.field2 = input2;
        this.field3 = input3;
    }
}

const state = new FormState(
    new InputState('Imię', minChars(10)),
    new InputState('Nazwisko', minChars(3)),
    new InputState('Jakieś inne pole', onlyNumbers),
);

type FormMobxInputPropsType = {|
    input: InputState,
|};

@observer
class FormMobxInput extends React.Component<FormMobxInputPropsType> {
    render() {
        const { input } = this.props;

        const error = input.error;

        const errorStyle = error === null
            ? {}
            : { color: 'red'};

        return (
            <div style={{ border: '1px solid white', padding: '10px' }}>
                <div>{ input.label }:</div>
                <div>
                    <div style={errorStyle}>{ error === null ? '' : 'Error: ' + error }</div>
                    <input value={ input.value } onChange={this._onChange} onBlur={this._onBlur} />
                </div>

                { /* <DevTools /> */ }
            </div>
        )
    }

    _onChange = (event) => {
        const { input } = this.props;
        input.setValue(event.target.value);
    };

    _onBlur = () => {
        const { input } = this.props;
        input.setBlur();
    };
}

type PropsType = {|
    className: string,
|};

@observer
export default class FormMobx extends React.Component<PropsType> {
    render() {
        const { className } = this.props;
        const styleButton = state.isValid
            ? {}
            : { opacity: '0.2' }; 

        return (
            <div className={className}>
                <div>Mobx formularz</div>
                <br/>
                <br/>
                <FormMobxInput input={state.field1} />
                <FormMobxInput input={state.field2} />
                <FormMobxInput input={state.field3} />
                <button style={styleButton}>Wyślij dane na serwer</button>
            </div>
        );
    }
}
