//@flow

import * as React from 'react';
import { Value } from '../Value';
import { ValueComputed } from '../ValueComputed';
import { logError } from './Log';

const isSSR = typeof window === 'undefined';

export class BaseComponent<Props> extends React.Component<Props, void> {

    _connections: Array<() => void>;

    _propsValue: Value<Props>;
    propsComputed: ValueComputed<Props>;

    componentDidCatch(error: {}, info: {}) {
        logError('componentDidCatch -> ', error, info);
    }

    componentWillReceiveProps(nextProps: Props) {
        this._propsValue.setValue(nextProps);
    }

    componentWillUnmount() {
        for (const item of this._connections) {
            item();
        }
    }

    constructor(props: Props) {
        super();

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
                item();
            }

            return renderOut;
        };
    }
    
    _refresh = () => {
        this.forceUpdate();
    }

    getFromComputed<T>(computed: ValueComputed<T>): T {
        const connection = computed.connect(this._refresh);

        if (isSSR) {
            connection.disconnect();
        } else {
            this._connections.push(connection.disconnect);
        }

        return connection.getValue();
    }
}
