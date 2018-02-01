//@flow

import * as React from 'react';

import Store from './Store/Store';
import { Computed, Connection, catchSubscriptions, catchSubscriptionsDisconnect } from 'computed-values';

const graph: Store = new Store();
const isSSR = typeof window === 'undefined';

export default class GraphPureComponent<Props, StateType = void> extends React.PureComponent<Props, StateType> {

    graph: Store;

    _updateComponent = () => {
        this.forceUpdate();

        //Component.prototype.forceUpdate.call(this)
        //https://github.com/mobxjs/mobx-react

        /*
        //$ FlowFixMe
        this.setState({
            __refresh: {}
        });
        */
    }

    componentDidCatch(error: {}, info: {}) {
        console.info('componentDidCatch -> ', error, info);

        catchSubscriptionsDisconnect(this._updateComponent);
    }

    componentWillUnmount() {
        catchSubscriptionsDisconnect(this._updateComponent);
    }

    constructor(props: Props) {

        super(props);

        this.graph = graph;

        const oldRender = this.render.bind(this);
        //$FlowFixMe        
        this.render = () => {
            return catchSubscriptions(this._updateComponent, oldRender);
        };
    }
}


/*
var proxy = new Proxy(props, {
    get: function(target, name, receiver) {
        var rv = target[name];
        console.info(`Props -> pobranie z ${rv}`);
        return rv;
    }
});
*/

