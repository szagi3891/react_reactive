//@flow
import * as React from 'react';
import { Value, ReactDecorator } from 'computed-values';

const counter = new Value(44);
const counter2 = new Value(1);

setInterval(() => {
    counter.setValue(counter.getValue() + 1);
}, 500);

setInterval(() => {
    counter2.setValue(counter2.getValue() + 1);
}, 3000);

const counter$ = counter.asComputed();
const char$ = counter2.asComputed()
    .map(count => '.'.repeat(Math.min(count, 30)));


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

        return (
            <div className={className}>
                <p>{ messageId } { counter }</p>
                <p>{char}</p>
            </div>
        );
    }
}
