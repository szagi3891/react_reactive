//@flow

import { ValueConnection } from './ValueConnection';
import { mergeSet } from './Utils';

export type AddParamType = {|
    notify: () => Set<() => void>,
    onRefresh: (() => void) | null
|};

export class ValueSubscription {
    _subscription: Map<mixed, AddParamType>;

    constructor(onChangeSubscribers: (count: number) => void) {
        this._subscription = new Map();
    }

    notify(): Set<() => void> {
        const allToRefresh = [];

        for (const item of this._subscription.values()) {
            if (item.onRefresh !== null) {
                allToRefresh.push(new Set([item.onRefresh]));
            }

            allToRefresh.push(item.notify());
        }

        return mergeSet(...allToRefresh);
    }

    buildCreatorForConnection<T>(getValue: () => T): ((param: AddParamType) => ValueConnection<T>) {
        return (param: AddParamType): ValueConnection<T> => {
            const token = {};

            this._subscription.set(token, {
                notify: param.notify,
                onRefresh: param.onRefresh,
            });

            return new ValueConnection(
                getValue,
                () => {
                    this._subscription.delete(token);
                }
            );
        };
    }

    bind<T>(getValue: () => T, onRefresh: (() => void) | null): ValueConnection<T> {
        const token = {};

        this._subscription.set(token, {
            notify: () => new Set(),
            onRefresh: onRefresh,
        });

        return new ValueConnection(
            getValue,
            () => {
                this._subscription.delete(token);
            }
        );
    }
}
