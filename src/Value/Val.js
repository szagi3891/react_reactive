//@flow

export class Val<T> {
    _token: number;
    _value: T;

    constructor(value: T) {
        this._token = getNext();
        this._value = value;
    }

    static of(value: T): Val<T> {
        return new Val(value);
    }
}
