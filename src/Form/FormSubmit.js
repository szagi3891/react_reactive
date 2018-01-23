//@flow
import { Computed } from 'computed-values';

type SubmitType = {|
    onSubmit: () => void,
    submitEnable: bool,
|};

export default <T>(
    data$: Computed<T>,
    submit$: Computed<(data: T) => void>
): Computed<SubmitType> => {
    const onSubmit$ = Computed.combine(
        data$,
        submit$,
        (data: T, submit: (data: T) => void) =>
            () => {
                submit(data);
            }
    );

    const submitEnable$ = data$.map(data => data !== null);

    return Computed.combine(
        onSubmit$,
        submitEnable$,
        (onSubmit, submitEnable) => ({
            onSubmit,
            submitEnable
        })
    );
};
