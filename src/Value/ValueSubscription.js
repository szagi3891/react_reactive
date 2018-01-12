//@flow

import { ValueConnection } from './ValueConnection';

export type AddParamType = {|
    hot: bool,
    notify: () => Set<() => void>,
    onRefresh: (() => void) | null
|};

export class ValueSubscription {
    _subscription: Map<mixed, AddParamType>;

    constructor(onChangeSubscribers: (count: number) => void) {
        this._subscription = new Map();
    }

    notify(): Set<() => void> {
        const allToRefresh = new Set();

        for (const item of this._subscription.values()) {
            if (item.onRefresh !== null) {
                allToRefresh.add(item.onRefresh);
            }

            const result = item.notify();
            for (const item of result) {
                allToRefresh.add(item);
            }
        }

        return allToRefresh;
    }

    buildCreatorForConnection<T>(getValue: () => T): ((param: AddParamType) => ValueConnection<T>) {
        return (param: AddParamType): ValueConnection<T> => {
            const token = {};

            this._subscription.set(token, {
                hot: param.hot,
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
            hot: false,
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

    hasShouldCache(): bool {
        if (this._subscription.size > 1) {
            return true;
        }

        if (this._subscription.size === 1) {
            for (const item of this._subscription.values()) {
                return item.hot;
            }
        }

        return false;
    }
}
