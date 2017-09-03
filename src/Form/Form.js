//@flow
import * as React from 'react';
import cx from 'classnames';
import BaseComponent from '../Lib/BaseComponent';
import { ValueObservable, Subject } from '../Lib/Reactive';

import InputState from './InputState';

import './Form.css';

const isNumber = (text: string): bool => parseInt(text, 10).toString() === text;

const isGrunwald = (text: string): bool => text === "1410";

const isHexDigit = (digit: string): bool => {
    if (isNumber(digit)) {
        return true;
    }

    const letter = digit.toLowerCase();
    return ["a", "b", "c", "d", "e", "f"].includes(letter);
}

export const isHex = (text: string): bool => {
    if (text.length === 0) {
        return false;
    }

    const maxIndex = text.length - 1;
    
    for (let i = 0; i <= maxIndex; i++) {
        if (isHexDigit(text[i]) === false) {
            return false;
        }
    }

    return true;
}

type PropsInputType = {|
    input: InputState,
    caption: string,
|};

class FormInput extends BaseComponent<PropsInputType> {

    render() {
        const { input, caption } = this.props;
        const value = this.getValue$(input.value$);
        const error = this.getValue$(input.errorForInput$);

        return (
            <div className="FormInput">
                <div>{caption}</div>

                <div className="FormInput__error">
                    { error }
                </div>
                
                <input
                    onChange={input.onChange}
                    onBlur={input.onBlur}
                    value={value}
                />
            </div>
        );
    }
}

const filterNull = (list: Array<string | null>): Array<string> => {
    return list.reduce((acc, current) => {
        if (current !== null) {
            acc.push(current);
        }
        return acc;
    }, []);
};

class FormState {   
}

type PropsType = {|
    className: string,
    onSubmit: (form: Array<string>) => void,
|};

export default class Form extends BaseComponent<PropsType> {

    inputs = [{
        key: 'field1',
        label: 'Wprowadź datę bitwy pod Grunwaldem',
        state: new InputState('Oczekiwano poprawnej daty', isGrunwald)
    }, {
        key: 'field2',
        label: 'Wprowadź wiek jakiśtam',
        state: new InputState('Oczekiwano poprawnego wieku', isNumber)
    }, {
        key: 'field3',
        label: 'Wprowadź liczbę szesnastkową',
        state: new InputState('Oczekiwano hasła do biosu', isHex)
    }];

    send: Subject<void> = new Subject();
    send$ = this.send.asObservable();

    _onSend = () => {
        this.send.next();
    }

    errors$: ValueObservable<Array<string>> = ValueObservable
        .combineLatestTupleArr(this.inputs.map(input => input.state.errorForForm$))
        .map(filterNull)
    ;

    data$: ValueObservable<Array<string>> = ValueObservable
        .combineLatestTupleArr(this.inputs.map(input => input.state.value$))
    ;

    constructor(props: PropsType) {
        super(props);

        this.subscribe$(
            this.send$
                .withLatestFrom3(
                    this.data$,
                    this.getProps$().map(props => props.onSubmit),
                    this.errors$
                )
                .do(([click, data, onSubmit, errors]) => {
                    if (errors.length === 0) {
                        onSubmit(data);
                    }
                })
        );
    }

    _renderInputs(): React.Node {
        return (
            <div>
                {
                    this.inputs.map(field => (
                        <FormInput
                            key={field.key}
                            input={field.state}
                            caption={field.label}
                        />
                    ))
                }
            </div>
        )
    }

    render() {
        const { className } = this.props;

        const errors = this.getValue$(this.errors$);

        const submitClassName = cx('FormSubmit', {
            'FormSubmit--disable': errors.length > 0
        });

        return (
            <div className={className}>
                { this._renderInputs() }

                <div className={submitClassName}>
                    <div className="FormSubmitButton" onClick={this._onSend}>
                        Wyślij
                    </div>
                </div>
            </div>
        );
    }
}
