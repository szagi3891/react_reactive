//@flow
import * as React from 'react';
import cx from 'classnames';
import BaseComponent from '../Lib/BaseComponent';

import FormInput from './FormInput';
import FormGroupState from './FormGroupState';

type PropsType = {|
    className: string,
    state: FormGroupState,
|};

export default class FormGroup extends BaseComponent<PropsType> {

    _renderInputs(): React.Node {
        const { state } = this.props;

        return (
            <div>
                {
                    state.inputs.map(field => (
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
        const { className, state } = this.props;
        const errors = this.getValue$(state.errors$);

        const submitClassName = cx('FormSubmit', {
            'FormSubmit--disable': errors.length > 0
        });

        return (
            <div className={className}>
                { this._renderInputs() }

                <div className={submitClassName}>
                    <div className="FormSubmitButton" onClick={state.onSend}>
                        Wyślij
                    </div>
                </div>
            </div>
        );
    }
}
