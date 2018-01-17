//@flow
import * as React from 'react';
import { Value } from 'computed-values';
import { BaseComponent } from '../BaseComponent';

const counter = new Value(44);
const counter2 = new Value(1);

setInterval(() => {
    counter.update(prevValue => {
        counter2.update(prevValue => prevValue);
        return prevValue + 1;
    });
}, 500);

setInterval(() => {
    counter2.update(prevValue => prevValue + 1);
}, 3000);

type PropsType = {|
    className: string,
    messageId: string,
|};

export default class MessageItem extends BaseComponent<PropsType> {

    counter$ = counter.asComputed();
    char$ = counter2.asComputed()
        .map(count => '.'.repeat(Math.min(count, 30)));

    render() {
        const { className, messageId } = this.props;
        const counter = this.getFromComputed(this.counter$);
        const char = this.getFromComputed(this.char$);

        return (
            <div className={className}>
                <p>{ messageId } { counter }</p>
                <p>{char}</p>
            </div>
        );
    }
}
