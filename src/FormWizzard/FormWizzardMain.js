//@flow
import * as React from 'react';
import cx from 'classnames';
import { BaseComponent } from 'react_reactive_value';

import FormGroupState from '../Form/FormGroupState';
import FormGroup from '../Form/FormGroup';

import FormWizzardMainState from './FormWizzardMainState';

import './FormWizzardMain.css';

type PropsType = {|
    className: string,
    state: FormWizzardMainState,
|};

export default class FormWizzard extends BaseComponent<PropsType> {
    render() {
        const { className, state } = this.props;

        const currentGroup: FormGroupState = this.getValue$(state.currentGroup$)
        const [currentSteep, maxSteep] = this.getValue$(state.currentSteep$);
        const prevEnable = this.getValue$(state.prevEnable$);
        const nextEnable = this.getValue$(state.nextEnable$);

        return (
            <div className={className}>
                <FormGroup
                    state={currentGroup}
                />
                { this._renderButton('Wstecz', state.back, prevEnable) }
                { this._renderButton('Dalej', state.next, nextEnable) }
                <br/>
                <br/>
                <div>
                    Krok { currentSteep } / { maxSteep }
                </div>
            </div>
        );
    }

    _renderButton = (label: string, onClick: () => void, enable: bool): React.Node => {
        const className = cx({
            buttonDisable: !enable
        });

        return (
            <button onClick={onClick} className={className}>
                {label}
            </button>
        );
    }
}
