//@flow

import * as React from 'react';
import { ValueSubject, ValueObservable, Subscription } from './Reactive';

const isSSR = typeof window === 'undefined';

export default class BaseComponent<Props> extends React.Component<Props, void> {

    _sub: Array<Subscription>;

    _props$: ValueSubject<Props>;

    componentWillReceiveProps(nextProps: Props) {
        this._props$.next(nextProps);
    }

    componentWillUnmount() {
        for (const sub of this._sub) {
            sub.unsubscribe();
        }
    }

    constructor(props: Props) {
        super();

        this._props$ = new ValueSubject(props);
        this._sub = [];

        const oldRender = this.render.bind(this);

        //$FlowFixMe
        this.render = () => {

            const old_sub = this._sub;
            this._sub = [];

            const renderOut = oldRender();

            for (const sub of old_sub) {
                sub.unsubscribe();
            }

            return renderOut;
        };
    }

    getProps$(): ValueObservable<Props> {
        return this._props$.asObservable();
    }

    getValue$<T>(stream: ValueObservable<T>): T {

        let isSet = false;
        //$FlowFixMe
        let result: T = null;

        const subscription = stream.take(2).subscribe(data => {
            if (isSet === false) {
                isSet = true;
                result = data;
            } else {
                                                        //TODO - do zbadania
                setTimeout(() => {
                    this.forceUpdate();
                }, 100);
            }
        })

        if (isSet !== true) {
            throw Error('panic');
        }

        if (isSSR) {
            subscription.unsubscribe();
        } else {
            this._sub.push(subscription);
        }

        return result;
    }
}

