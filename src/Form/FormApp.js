//@flow
import * as React from 'react';
import cx from 'classnames';
import { BaseComponent } from '../BaseComponent';
import FormGroupState from './FormGroupState';
import FormGroup from './FormGroup';
import createFormSubmit from './FormSubmit';

import './FormApp.css';

type PropsType = {|
    className: string,
    state: FormGroupState,
    onSubmit: (data: Array<string> | null) => void,
|};

export default class FormApp extends BaseComponent<PropsType> {

    submit$ = createFormSubmit(
        this.propsComputed.switchMap(props => props.state.data$),
        this.propsComputed.map(props => props.onSubmit)
    );

    render() {
        const { className, state } = this.props;
        const submit = this.submit$.value();

        const submitClassName: string = cx('FormSubmit', {
            'FormSubmit--disable': !submit.submitEnable
        });

        return (
            <div className={className}>
                <FormGroup
                    state={state}
                />

                <div className={submitClassName}>
                    <div className="FormSubmitButton" onClick={submit.onSubmit}>
                        send
                    </div>
                </div>
            </div>
        );
    }
}

