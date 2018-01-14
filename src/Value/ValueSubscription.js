//@flow

export const mergeSet = <T>(...list: Array<Set<T>>): Set<T> => {
    const result = new Set();

    for (const argItem of list) {
        for (const item of argItem) {
            result.add(item);
        }
    }

    return result;
};

export class ValueSubscription {
    _subscription: Map<mixed, () => Set<() => void>>;
    _onIdlee: () => void;

    constructor(onIdlee: () => void) {
        this._subscription = new Map();
        this._onIdlee = onIdlee;
    }

    notify(): Set<() => void> {
        const allToRefresh = [];

        for (const item of this._subscription.values()) {
            allToRefresh.push(item());
        }

        return mergeSet(...allToRefresh);
    }

    bind(notify: () => Set<() => void>): () => void {
        const token = {};

        this._subscription.set(token, notify);

        return () => {
            this._subscription.delete(token);

            if (this._subscription.size === 0) {
                this._onIdlee();
            }
        }
    }
}
