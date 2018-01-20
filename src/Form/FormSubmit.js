//@flow
import { ValueComputed } from 'computed-values';

type SubmitType = {|
    onSubmit: () => void,
    submitEnable: bool,
|};

export default <T>(
    data$: ValueComputed<T>,
    submit$: ValueComputed<(data: T) => void>
): ValueComputed<SubmitType> => {
    const onSubmit$ = ValueComputed.combine(
        data$,
        submit$,
        (data: T, submit: (data: T) => void) =>
            () => {
                submit(data);
            }
    );

    const submitEnable$ = data$.map(data => data !== null);

    return ValueComputed.combine(
        onSubmit$,
        submitEnable$,
        (onSubmit, submitEnable) => ({
            onSubmit,
            submitEnable
        })
    );
};
