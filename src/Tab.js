//@flow

import * as React from 'react';
import './App.css';
import { BaseComponent } from 'computed-values';

type PropsType = {|
    className: string,
    value: string,
    onClick: (value: string) => void,
    children?: React.Node,
|};

export default class Tab extends BaseComponent<PropsType> {

    _onClick = () => {
        const { value, onClick } = this.props;
        onClick(value);
    }

    render() {
        const { className, children } = this.props;

        return (
            <div className={className} onClick={this._onClick}>{children}</div>
        );
    }
}

