//@flow
import * as React from 'react';
import { Value, ReactDecorator, Computed } from 'computed-values';

const counter = new Value(44);
const counter2 = new Value(1);

const counter$ = counter.asComputed();
const counter2$ = counter2.asComputed();

setInterval(() => {
    counter.setValue(counter.getValue() + 1);
}, 500);

setInterval(() => {
    counter2.setValue(counter2.getValue() + 1);
}, 3000);

const char$ = counter2$
    .map(count => '.'.repeat(Math.min(count, 30)));

const sum$ = Computed.combine(
    counter$,
    counter2$,
    (counter1, counter2) => counter1 + counter2
);

type PropsType = {|
    className: string,
    messageId: string,
|};

@ReactDecorator
export default class MessageItem extends React.Component<PropsType> {
    render() {
        const { className, messageId } = this.props;
        const counter = counter$.value();
        const char = char$.value();
        const sum = sum$.value();

        return (
            <div className={className}>
                <p>{ messageId } { counter }</p>
                <p>{char}</p>
                <p>Suma: { sum }</p>
            </div>
        );
    }
}
