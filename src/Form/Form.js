//@flow
import * as React from 'react';
import cx from 'classnames';
import BaseComponent from '../Lib/BaseComponent';
import { ValueObservable, Subject } from '../Lib/Reactive';

import FormInputState from './FormInputState';
import FormInput from './FormInput';
import FormState from './FormState';

import './Form.css';

type PropsType = {|
    className: string,
    formState: FormState,
|};

export default class Form extends BaseComponent<PropsType> {

    formState$ = this
        .getProps$()
        .map(props => props.formState);

    _renderInputs(): React.Node {
        const formState = this.getValue$(this.formState$);

        return (
            <div>
                {
                    formState.inputs.map(field => (
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

        const formState = this.getValue$(this.formState$);        
        const errors = this.getValue$(formState.errors$);

        const submitClassName = cx('FormSubmit', {
            'FormSubmit--disable': errors.length > 0
        });

        return (
            <div className={className}>
                { this._renderInputs() }

                <div className={submitClassName}>
                    <div className="FormSubmitButton" onClick={formState.onSend}>
                        Wyślij
                    </div>
                </div>
            </div>
        );
    }
}
