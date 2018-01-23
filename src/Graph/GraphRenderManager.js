//@flow

import { Computed } from 'computed-values';

type GetValueType = <T>(stream: Computed<T>) => T;

class GraphRenderManager {

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

        throw Error('getValue$ - has been called outside the render function');
    }

    renderExit() {
        this._getValue$ = null;
    }
}

export default new GraphRenderManager();
