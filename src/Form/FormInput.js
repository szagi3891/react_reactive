//@flow
import * as React from 'react';
import { BaseComponent } from 'computed-values';
import FormInputState from './FormInputState';

import './FormInput.css';

type PropsInputType = {|
    input: FormInputState,
    caption: string,
|};

export default class FormInput extends BaseComponent<PropsInputType> {

    render() {
        const { input, caption } = this.props;
        const value = this.getFromComputed(input.value$);
        const error = this.getFromComputed(input.error$);

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
