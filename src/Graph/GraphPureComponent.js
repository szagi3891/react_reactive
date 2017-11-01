//@flow

import * as React from 'react';

import GraphRenderManager from './GraphRenderManager';
import GraphConnection from './GraphConnection';
import Graph from './Graph';

const graphRenderManager = new GraphRenderManager();
const graph: Graph = new Graph(graphRenderManager);

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
            graphRenderManager,
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
