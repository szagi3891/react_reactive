//@flow
import * as React from 'react';
import { BaseComponent } from '../BaseComponent';

import FormInput from './FormInput';
import FormGroupState from './FormGroupState';

type PropsType = {|
    state: FormGroupState,
|};

export default class FormGroup extends BaseComponent<PropsType> {
    render() {
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
        );
    }
}
