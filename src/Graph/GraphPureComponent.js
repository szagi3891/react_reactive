//@flow

import * as React from 'react';

import Store from './Store/Store';
import { Computed, groupConnectionRefresh, Connection } from 'computed-values';
import RenderManager from './RenderManager';

const graph: Store = new Store();
const isSSR = typeof window === 'undefined';

export default class GraphPureComponent<Props, StateType = void> extends React.PureComponent<Props, StateType> {

    _subscriptionForRender: Array<Connection<mixed>>;
    graph: Store;

    componentDidCatch(error: {}, info: {}) {
        console.info('componentDidCatch -> ', error, info);

        for (const sub of this._subscriptionForRender) {
            sub.disconnect();
        }
        this._subscriptionForRender = [];
    }

    componentWillUnmount() {
        for (const sub of this._subscriptionForRender) {
            sub.disconnect();
        }
        this._subscriptionForRender = [];
    }

    constructor(props: Props) {

        /*
        var proxy = new Proxy(props, {
            get: function(target, name, receiver) {
                var rv = target[name];
                console.info(`Props -> pobranie z ${rv}`);
                return rv;
            }
        });
        */

        super(props);

        this._subscriptionForRender = [];
        this.graph = graph;

        const oldRender = this.render.bind(this);

        const newRender = (): React.Node => {
            const old_sub = this._subscriptionForRender;
            this._subscriptionForRender = [];
    
            RenderManager.setCurrent(this.getValue$);
            const renderOut = oldRender();
            RenderManager.renderExit();
    
            for (const sub of old_sub) {
                sub.disconnect();
            }
    
            groupConnectionRefresh(this._subscriptionForRender, this._updateComponent);

            return renderOut;
        };

        //$FlowFixMe
        this.render = newRender;
    }

    getValue$ = <T>(stream: Computed<T>): T => {
        const connect = stream.bind();
        const result = connect.getValue();

        if (isSSR) {
            connect.disconnect();
        } else {
            //$FlowFixMe
            this._subscriptionForRender.push(connect);
        }

        return result;
    }

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
}
