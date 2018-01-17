//@flow

import * as React from 'react';
import { ValueComputed } from 'computed-values';
import GraphRenderManager from './GraphRenderManager';

const isSSR = typeof window === 'undefined';

export default class GraphConnection {

    _subscriptionForRender: Array<() => void>;

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
            sub();
        }

        return renderOut;
    };

    unmount() {
        for (const sub of this._subscriptionForRender) {
            sub();
        }
    }

    getValue$ = <T>(stream: ValueComputed<T>): T => {
        const connect = stream.connect(this._updateComponent);
        const result = connect.getValue();

        if (isSSR) {
            connect.disconnect();
        } else {
            this._subscriptionForRender.push(connect.disconnect);
        }

        return result;
    };
}