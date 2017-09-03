//@flow
import * as React from 'react';
import cx from 'classnames';
import BaseComponent from '../Lib/BaseComponent';
import { ValueSubject, ValueObservable, Subject } from '../Lib/Reactive';

import './Form.css';

export type FormType = {
    input1: string,
    input2: string,
    input3: string
};

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

class InputState {
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
    
type PropsType = {|
    className: string,
    onSubmit: (form: FormType) => void,
|};

export default class Form extends BaseComponent<PropsType> {

    input1 = new InputState('Oczekiwano poprawnej daty', isGrunwald);
    input2 = new InputState('Oczekiwano poprawnego wieku', isNumber);
    input3 = new InputState('Oczekiwano hasła do biosu', isHex);

    send: Subject<void> = new Subject();
    send$ = this.send.asObservable();

    _onSend = () => {
        this.send.next();
    }

    errors$: ValueObservable<Array<string>> = ValueObservable.combineLatestTuple3(
        this.input1.errorForForm$,
        this.input2.errorForForm$,
        this.input3.errorForForm$,
    ).map(([error1, error2, error3]) => {
        const out = [];

        if (error1 !== null) {
            out.push(error1);
        }

        if (error2 !== null) {
            out.push(error2);
        }

        if (error3 !== null) {
            out.push(error3);
        }

        return out;
    });

    data$: ValueObservable<FormType> = ValueObservable.combineLatestTuple3(
        this.input1.value$,
        this.input2.value$,
        this.input3.value$
    ).map(([value1, value2, value3]) => ({
        input1: value1,
        input2: value2,
        input3: value3
    }));

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

    render() {
        const { className } = this.props;

        const errors = this.getValue$(this.errors$);

        const submitClassName = cx('FormSubmit', {
            'FormSubmit--disable': errors.length > 0
        });

        return (
            <div className={className}>
                <FormInput input={this.input1} caption="Wprowadź datę bitwy pod Grunwaldem" />
                <FormInput input={this.input2} caption="Wprowadź wiek jakiśtam" />
                <FormInput input={this.input3} caption="Wprowadź liczbę szesnastkową" />

                <div className={submitClassName}>
                    <div className="FormSubmitButton" onClick={this._onSend}>
                        Wyślij
                    </div>
                </div>
            </div>
        );
    }
}
