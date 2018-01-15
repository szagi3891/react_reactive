//@flow
import { ValueComputed, combineValue } from '../Value';

type SubmitType = {|
    onSubmit: () => void,
    submitEnable: bool,
|};

export default <T>(
    data$: ValueComputed<T>,
    submit$: ValueComputed<(data: T) => void>
): ValueComputed<SubmitType> => {
    const onSubmit$ = combineValue(
        data$,
        submit$,
        (data: T, submit: (data: T) => void) =>
            () => {
                submit(data);
            }
    );

    const submitEnable$ = data$.map(data => data !== null);

    return combineValue(
        onSubmit$,
        submitEnable$,
        (onSubmit, submitEnable) => ({
            onSubmit,
            submitEnable
        })
    );
};
