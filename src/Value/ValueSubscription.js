//@flow
import { transaction } from './transaction';

export class ValueSubscription {
    _subscription: Map<mixed, () => void>;
    _onIdlee: () => void;

    constructor(onIdlee: () => void) {
        this._subscription = new Map();
        this._onIdlee = onIdlee;
    }

    notify() {
        for (const item of this._subscription.values()) {
            transaction(() => {
                item();
            });
        }
    }

    bind(notify: () => void): () => void {
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
