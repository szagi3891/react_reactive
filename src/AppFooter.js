//@flow

import * as React from 'react';

import { BaseComponent } from './BaseComponent'
import { AppContext } from './AppContext';

type PropsType = {|
    className: string,
|};

export default class AppFooter extends BaseComponent<PropsType> {
    render(): React.Node {
        const { className } = this.props;

        return (
            <div className={className}>
                Context
                <AppContext.Consumer>
                    {(context) => {
                        return (
                            <div> { context.appCounter } </div>
                        )
                    }}
                </AppContext.Consumer>
            </div>
        )
    }
}

