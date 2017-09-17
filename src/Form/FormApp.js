//@flow
import * as React from 'react';
import cx from 'classnames';
import BaseComponent from '../Lib/BaseComponent';
import FormGroupState from './FormGroupState';
import FormGroup from './FormGroup';

import './FormApp.css';

type PropsType = {|
    className: string,
    state: FormGroupState,
|};

export default class FormApp extends BaseComponent<PropsType> {
    render() {
        const { className, state } = this.props;

        return (
            <FormGroup
                className={className}
                state={state}
            />
        );
    }
}

