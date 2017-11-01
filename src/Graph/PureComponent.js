//@flow

import * as React from 'react';
import { ValueObservable, Subscription } from 'react_reactive_value';

import GraphRenderManager from './GraphRenderManager';
import Graph from './Graph';

const isSSR = typeof window === 'undefined';

const graphRenderManager = new GraphRenderManager();
const graph: Graph = new Graph(graphRenderManager);

export default class PureComponent<Props, StateType = void> extends React.Component<Props, StateType> {

    _subscriptionForRender: Array<Subscription>;

    graph: Graph;

    componentDidCatch(error: {}, info: {}) {
        console.info('componentDidCatch -> ', error, info);
    }

    componentWillUnmount() {
        for (const sub of this._subscriptionForRender) {
            sub.unsubscribe();
        }
    }

    constructor(props: Props) {
        super();

        this._subscriptionForRender = [];

        this.graph = graph;

        const oldRender = this.render.bind(this);

        //$FlowFixMe
        this.render = () => {

            const old_sub = this._subscriptionForRender;
            this._subscriptionForRender = [];

            graphRenderManager.setCurrent(this.getValue$);
            const renderOut = oldRender();
            graphRenderManager.renderExit();

            for (const sub of old_sub) {
                sub.unsubscribe();
            }

            return renderOut;
        };
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
                //this.forceUpdate();

                //$FlowFixMe
                this.setState({
                    __refresh: {}
                });
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
