//@flow

import * as React from 'react';
import { ValueObservable, Subscription } from 'react_reactive_value';

import Graph from './Graph';
import GraphBind from './GraphBind';

const isSSR = typeof window === 'undefined';

const graph: Graph = new Graph();

export default class PureComponent<Props, StateType = void> extends React.Component<Props, StateType> {

    _subscriptionForRender: Array<Subscription>;

    graph: GraphBind;

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

        const getValue$ = <T>(stream: ValueObservable<T>): T => {
    
            let isSet = false;
            //$FlowFixMe
            let result: T = null;
    
            const subscription = stream.subscribe(data => {
                if (isSet === false) {
                    isSet = true;
                    result = data;
                } else {
                    this.forceUpdate();
                }
            });
    
            if (isSet !== true) {
                throw Error('panic');
            }
    
            if (isSSR) {
                subscription.unsubscribe();
            } else {
                this._subscriptionForRender.push(subscription);
            }
    
            return result;
        };

        this.graph = new GraphBind(graph, getValue$);

        const oldRender = this.render.bind(this);

        //$FlowFixMe
        this.render = () => {

            const old_sub = this._subscriptionForRender;
            this._subscriptionForRender = [];

            const renderOut = oldRender();

            for (const sub of old_sub) {
                sub.unsubscribe();
            }

            return renderOut;
        };
    }
}
