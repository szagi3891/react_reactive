//@flow
import Rx from 'rxjs';

import { Subscription } from './Subscription';
import { Observable, ValueObservable } from './Observable';
import { Subject } from './Subject';
import { ValueSubject } from './ValueSubject';

export {
	Subscription,
	Observable,
	ValueObservable,
	Subject,
	ValueSubject
};

/*
function createState(reducer$, initialState$ = Rx.Observable.of({})) {
  return initialState$
    .merge(reducer$)
    .scan((state, [scope, reducer]) =>
      ({ ...state, [scope]: reducer(state[scope]) }))
    .publishReplay(1)
    .refCount();
}
*/
