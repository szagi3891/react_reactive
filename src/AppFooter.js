//@flow

import * as React from 'react';

import { BaseComponent } from './BaseComponent'
import { AppContext } from './AppContext';

type PropsType = {||};

export default class AppFooter extends BaseComponent<PropsType> {

    render(): React.Node {
        return (
            <div>
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

