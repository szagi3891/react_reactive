//@flow
import * as React from 'react';
import { BaseComponent } from '../BaseComponent';
import FormInputState from './FormInputState';

import './FormInput.css';

type PropsInputType = {|
    input: FormInputState,
    caption: string,
|};

export default class FormInput extends BaseComponent<PropsInputType> {

    render() {
        const { input, caption } = this.props;
        const value = input.value$.value();
        const error = input.error$.value();

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
