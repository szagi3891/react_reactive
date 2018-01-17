//@flow
import * as React from 'react';
import cx from 'classnames';
import { BaseComponent } from '../BaseComponent';

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

        const currentGroup: FormGroupState = this.getFromComputed(state.currentGroup$)
        const [currentSteep, maxSteep] = this.getFromComputed(state.currentSteep$);
        const prevEnable = this.getFromComputed(state.prevEnable$);
        const nextEnable = this.getFromComputed(state.nextEnable$);

        return (
            <div className={className}>
                <FormGroup
                    state={currentGroup}
                />
                { this._renderButton('Back', state.back, prevEnable) }
                { this._renderButton('Next', state.next, nextEnable) }
                <br/>
                <br/>
                <div>
                    Steep { currentSteep } / { maxSteep }
                </div>
            </div>
        );
    }

    _renderButton = (label: string, onClick: () => void, enable: bool): React.Node => {
        const className: string = cx({
            buttonDisable: !enable
        });

        return (
            <button onClick={onClick} className={className}>
                {label}
            </button>
        );
    }
}
