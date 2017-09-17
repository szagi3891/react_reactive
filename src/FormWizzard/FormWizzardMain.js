//@flow
import * as React from 'react';
import cx from 'classnames';
import BaseComponent from '../Lib/BaseComponent';

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
