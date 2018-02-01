//@flow

import * as React from 'react';
import { Value, Computed, Connection, catchSubscriptions, catchSubscriptionsDisconnect } from 'computed-values';

const isSSR = typeof window === 'undefined';

export class BaseComponent<Props> extends React.Component<Props, void> {

    _propsValue: Value<Props>;
    propsComputed: Computed<Props>;

    componentDidCatch(error: {}, info: {}) {
        console.error('componentDidCatch -> ', error, info);
    }

    componentWillReceiveProps(nextProps: Props) {
        this._propsValue.setValue(nextProps);
    }

    _refresh = () => {
        this.forceUpdate();
    }

    componentWillUnmount() {
        catchSubscriptionsDisconnect(this._refresh);
    }

    constructor(props: Props) {
        super(props);

        this._propsValue = new Value(props);
        this.propsComputed = this._propsValue.asComputed();

        const oldRender = this.render.bind(this);
        
        //$FlowFixMe
        this.render = () => {
            return catchSubscriptions(this._refresh, () => oldRender());
        };
    }

    getFromComputed<T>(computed: Computed<T>): T {
        return computed.value();
    }
}
