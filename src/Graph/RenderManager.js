//@flow

import { Computed } from 'computed-values';

type GetValueType = <T>(stream: Computed<T>) => T;

class RenderManager {

    _getValue$: null | GetValueType;

    construtor(){
        this._getValue$ = null;
    }

    setCurrent(getValue$: GetValueType) {
        this._getValue$ = getValue$;
    }

    getValue$<T>(stream: Computed<T>): T {
        if (this._getValue$ !== null) {
            return this._getValue$(stream);
        }

        return stream.getValueSnapshot();
    }

    renderExit() {
        this._getValue$ = null;
    }
}

export default new RenderManager();
