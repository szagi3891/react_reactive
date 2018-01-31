//@flow

import * as React from 'react';
import { Value, Computed, groupConnectionRefresh, Connection } from 'computed-values';

const isSSR = typeof window === 'undefined';

export class BaseComponent<Props> extends React.Component<Props, void> {

    _connections: Array<Connection<mixed>>;

    _propsValue: Value<Props>;
    propsComputed: Computed<Props>;

    componentDidCatch(error: {}, info: {}) {
        console.error('componentDidCatch -> ', error, info);
    }

    componentWillReceiveProps(nextProps: Props) {
        this._propsValue.setValue(nextProps);
    }

    componentWillUnmount() {
        for (const item of this._connections) {
            item.disconnect();
        }
    }

    constructor(props: Props) {
        super(props);

        this._connections = [];

        this._propsValue = new Value(props);
        this.propsComputed = this._propsValue.asComputed();

        const oldRender = this.render.bind(this);

        //$FlowFixMe
        this.render = () => {

            const old_connections = this._connections;
            this._connections = [];

            const renderOut = oldRender();

            for (const item of old_connections) {
                item.disconnect();
            }

            groupConnectionRefresh(this._connections, this._refresh);

            return renderOut;
        };
    }
    
    _refresh = () => {
        this.forceUpdate();
    }

    getFromComputed<T>(computed: Computed<T>): T {
        const connection = computed.bind();

        if (isSSR) {
            connection.disconnect();
        } else {
            //$FlowFixMe
            this._connections.push(connection);
        }

        return connection.getValue();
    }
}
