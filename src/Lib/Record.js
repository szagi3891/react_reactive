//@flow

import { Map as IMap, is as isEqualImmutable } from 'immutable';

export class BaseRecord<T: Object> {                                //eslint-disable-line flowtype/no-weak-types

    _data: IMap<$Keys<T>, any>;                                     //eslint-disable-line flowtype/no-weak-types

    constructor(data: T) {
        this._data = IMap(data);
    }

    get<Key: string>(name: Key): $ElementType<T, Key> {
        return this._data.get(name);
    }

    _create(data: IMap<$Keys<T>, any>): this {                      //eslint-disable-line flowtype/no-weak-types
        const constructor = this.constructor;
        const result = Object.create(constructor.prototype);
        result._data = data;
        //$FlowFixMe
        return result;
    }

    merge(newData: $Shape<T>): this {
        const newInnerData = this._data.merge(newData);

        if (isEqualImmutable(this._data, newInnerData)) {
            return this;
        }

        return this._create(newInnerData);
    }

    equals(other: BaseRecord<T>): bool {
        return this._data.equals(other._data);
    }

    hashCode(): number {
        return this._data.hashCode();
    }
}
