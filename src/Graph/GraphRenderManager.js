//@flow

import { ValueComputed } from 'computed-values';

type GetValueType = <T>(stream: ValueComputed<T>) => T;

class GraphRenderManager {

    _getValue$: null | GetValueType;

    construtor(){
        this._getValue$ = null;
    }

    setCurrent(getValue$: GetValueType) {
        this._getValue$ = getValue$;
    }

    getValue$<T>(stream: ValueComputed<T>): T {
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
