//@flow
import * as React from 'react';
import cx from 'classnames';
import BaseComponent from '../Lib/BaseComponent';

import FormInput from './FormInput';
import FormState from './FormState';

import './Form.css';

type PropsType = {|
    className: string,
    formState: FormState,
|};

export default class Form extends BaseComponent<PropsType> {

    _renderInputs(): React.Node {
        const { formState } = this.props;

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

        const { formState } = this.props;
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
