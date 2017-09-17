//@flow
import { Subject, ValueSubject, ValueObservable } from 'react_reactive_value';

export default class FormSubmitState<T> {

    _submit = new Subject();
/*
    $data: ValueObservable<T>;

    constructor(data$: ValueObservable<T | null>) {
        this.data$ = this._submit.asObservable()
            .startWith(() => data$.take(1));
    }
*/
}
