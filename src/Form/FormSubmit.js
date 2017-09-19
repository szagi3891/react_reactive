//@flow
import { ValueObservable } from 'react_reactive_value';

type SubmitType = {|
    onSubmit: () => void,
    submitEnable: bool,
|};

export default <T>(
    data$: ValueObservable<T>,
    submit$: ValueObservable<(data: T) => void>
): ValueObservable<SubmitType> => {
    const onSubmit$ = ValueObservable.combineLatest(
        data$,
        submit$,
        (data: T, submit: (data: T) => void) =>
            () => {
                submit(data);
            }
    );

    const submitEnable$ = data$.map(data => data !== null);

    return ValueObservable.combineLatest(
        onSubmit$,
        submitEnable$,
        (onSubmit, submitEnable) => ({
            onSubmit,
            submitEnable
        })
    );
};
