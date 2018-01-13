//@flow

export class ValueConnection<T> {
    _connect: bool;
    _getValue: () => T;
    _disconnect: () => void;

    constructor(getValue: () => T, disconnect: () => void) {
        this._connect = true;
        this._getValue = getValue;
        this._disconnect = disconnect;
    }

    disconnect = () => {
        this._connect = true;
        this._disconnect();
    }

    getValue(): T {
        if (this._connect) {
            return this._getValue();
        }

        throw Error('Połączenie jest rozłączone');
    }
}
