//@flow
import * as React from 'react';
import cx from 'classnames';
import { BaseComponent } from 'react_reactive_value';

import FormWizzardMainState from './FormWizzardMainState';

type PropsType = {|
    className: string,
    state: FormWizzardMainState,
|};

export default class FormWizzard extends BaseComponent<PropsType> {
    render() {
        const { className } = this.props;

        return (
            <div className={className}>
                Wizzard
            </div>
        );
    }
}
