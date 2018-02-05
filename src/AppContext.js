//@flow

import * as React from 'react';
import { Value } from 'computed-values';

//$FlowFixMe
export const AppContext = React.createContext({
    appCounter: 0
});

const AppContextCounterVal = new Value(0);
export const AppContextCounter = AppContextCounterVal.asComputed();

setInterval(() => {
    AppContextCounterVal.setValue(AppContextCounterVal.getValue() + 2);
}, 1000);
