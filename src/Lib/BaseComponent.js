//@flow

import * as React from 'react';
import { Observable, ValueSubject, ValueObservable, Subscription } from './Reactive';

const isSSR = typeof window === 'undefined';

export default class BaseComponent<Props> extends React.Component<Props, void> {

    _subscriptionForComponent: Array<Subscription>;
    _subscriptionForRender: Array<Subscription>;

    _props$: ValueSubject<Props>;

    componentDidCatch(error, info) {
        console.info('componentDidCatch -> ', error, info);
    }

    componentWillReceiveProps(nextProps: Props) {
        this._props$.next(nextProps);
    }

    componentWillUnmount() {
        for (const sub of this._subscriptionForComponent) {
            sub.unsubscribe();
        }
    
        for (const sub of this._subscriptionForRender) {
            sub.unsubscribe();
        }
    }

    constructor(props: Props) {
        super();

        this._subscriptionForComponent = [];
        this._subscriptionForRender = [];

        this._props$ = new ValueSubject(props);

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
                this.forceUpdate();
            }
        })

        if (isSet !== true) {
            throw Error('panic');
        }

        if (isSSR) {
            subscription.unsubscribe();
        } else {
            this._subscriptionForRender.push(subscription);
        }

        return result;
    }

    subscribe$<T>(obs: Observable<T>) {
        this._subscriptionForComponent.push(
            obs.subscribe(() => {})
        )
    }
}

