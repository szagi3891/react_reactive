// @flow

import * as React from 'react';
import { ValueSubject, ValueObservable, Subscription } from 'Lib/Core/Reactive';
import { is as isEqualImmutable } from 'immutable';

const shoudUpdate = (oldObj: mixed, newObj: mixed): bool => {
    if (oldObj === newObj) {
        return false;
    }

    if (typeof newObj !== 'object' || typeof oldObj !== 'object') {
        return true;
    }

    if (newObj === null || oldObj === null) {
        return true;
    }

    const oldKeys = Object.keys(newObj);
    const newKeys = Object.keys(oldObj);

    if (oldKeys.length !== newKeys.length) {
        return true;
    }

    for (let i = 0; i < oldKeys.length; i++) {
        const oldData = oldObj[oldKeys[i]];
        const newData = newObj[newKeys[i]];

        if (!isEqualImmutable(oldData, newData)) {
            return true;
        }
    }

    return false;
};


/*
    wzorowane na : https://github.com/acdlite/react-rx-component
*/


const isSSR = typeof window === 'undefined';


const isEqualProps = (a: mixed, b: mixed): bool => !shoudUpdate(a, b);

export const createRxComponent = <PropsTypeIn: {}, PropsTypeOut: {}>(
    componentName: string, 
    mapProps: (observable: ValueObservable<PropsTypeIn>) => ValueObservable<PropsTypeOut>,
    InnerComponent: React.ComponentType<PropsTypeOut>
): React.ComponentType<PropsTypeIn> => {

    //$FlowFixMe
    InnerComponent.displayName = `${componentName}Inner`;

    return class RxComponent extends React.Component<PropsTypeIn> {

        mounted$: ValueSubject<bool>;
        receive$: ValueSubject<PropsTypeIn>;
        innerProps: PropsTypeOut | null;

        subscription: Subscription;
        
        static displayName = `${componentName}`;

        constructor(props: PropsTypeIn) {
            super(props);

            this.receive$ = new ValueSubject(this.props);
            this.mounted$ = new ValueSubject(false);
            this.innerProps = null;

            const newProps$ = mapProps(this.receive$.asObservable())
                .distinctUntilChanged(isEqualProps);

            this.subscription = newProps$
                .withLatestFrom(this.mounted$.asObservable())
                .subscribe(([props, mounted]) => {
                    this.innerProps = props;

                    if (mounted) {
                        this.forceUpdate();
                    }
                });

            if (isSSR) {
                this.subscription.unsubscribe();
            }
        }

        shouldComponentUpdate() {
            return false;
        }

        componentWillMount() {
            this.mounted$.next(true);
        }

        componentWillReceiveProps(nextProps: PropsTypeIn) {
            this.receive$.next(nextProps);
        }

        componentWillUnmount() {
            this.mounted$.next(false);
            this.subscription.unsubscribe();
        }

        render(): React.Node {
            if (this.innerProps !== null) {
                return (
                    <InnerComponent {...this.innerProps} />
                );
            } else {
                throw Error(`panic - to nigdy nie powinno się wydarzyć - ${componentName}`);
            }
        }

        componentDidCatch(error, info) {
            console.info('RxComponent componentDidCatch -> ', error, info);
        }
    };
};
