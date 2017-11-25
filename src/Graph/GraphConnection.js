//@flow

import * as React from 'react';
import { ValueObservable, Subscription } from 'react_reactive_value';
import GraphRenderManager from './GraphRenderManager';

const isSSR = typeof window === 'undefined';

export default class GraphConnection {

    _subscriptionForRender: Array<Subscription>;

    _oldRender: () => React.Node;
    _updateComponent: () => void;

    constructor(oldRender: () => React.Node, updateComponent: () => void) {
        this._subscriptionForRender = [];
        this._oldRender = oldRender;
        this._updateComponent = updateComponent;
    }

    newRender = (): React.Node => {
        const old_sub = this._subscriptionForRender;
        this._subscriptionForRender = [];

        GraphRenderManager.setCurrent(this.getValue$);
        const renderOut = this._oldRender();
        GraphRenderManager.renderExit();

        for (const sub of old_sub) {
            sub.unsubscribe();
        }

        return renderOut;
    };

    unmount() {
        for (const sub of this._subscriptionForRender) {
            sub.unsubscribe();
        }
    }

    getValue$ = <T>(stream: ValueObservable<T>): T => {
        
        let isSet = false;
        //$FlowFixMe
        let result: T = null;

        const subscription = stream.subscribe(data => {
            if (isSet === false) {
                isSet = true;
                result = data;
            } else {
                this._updateComponent();
            }
        });

        if (isSet !== true) {
            throw Error('getValue - not available branches');
        }

        if (isSSR) {
            subscription.unsubscribe();
        } else {
            this._subscriptionForRender.push(subscription);
        }

        return result;
    };
}