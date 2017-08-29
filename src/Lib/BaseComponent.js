//@flow

import * as React from 'react';
import { ValueSubject, ValueObservable, Subscription } from './Reactive';


export default class BaseComponent<Props, State=void> extends React.Component<Props, State> {

    _sub: Array<Subscription>;

    _props$: ValueSubject<Props>;

    componentWillReceiveProps(nextProps: Props) {
        this._props$.next(nextProps);
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

            console.info('render');
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

        this._sub.push(stream.take(2).subscribe(data => {
            if (isSet === false) {
                isSet = true;
                result = data;
            } else {
                this.forceUpdate();
            }
        }));

        if (isSet !== true) {
            throw Error('panic');
        }

        return result;
    }
}

