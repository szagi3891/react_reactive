//@flow

import * as React from 'react';

import GraphConnection from './GraphConnection';
import Graph from './Graph';

const graph: Graph = new Graph();

export default class GraphPureComponent<Props, StateType = void> extends React.PureComponent<Props, StateType> {

    _graphConnection: GraphConnection;
    graph: Graph;

    componentDidCatch(error: {}, info: {}) {
        console.info('componentDidCatch -> ', error, info);
    }

    componentWillUnmount() {
        this._graphConnection.unmount();
    }

    constructor(props: Props) {
        super();

        this.graph = graph;
        this._graphConnection = new GraphConnection(
            this.render.bind(this),
            () => {
                //this.forceUpdate();

                //$FlowFixMe
                this.setState({
                    __refresh: {}
                });
            }
        );

        //$FlowFixMe
        this.render = this._graphConnection.newRender;
    }
}

/*
Do późniejszego wykorzystania

var original = {
    "foo": "bar"
};
var proxy = new Proxy(original, {
    get: function(target, name, receiver) {
        var rv = target[name];
        if (typeof rv === "string") {
            rv = rv.toUpperCase();
        }
        return rv;
      }
});
console.log("original.foo = " + original.foo); // "bar"
console.log("proxy.foo = " + proxy.foo);       // "BAR"
*/