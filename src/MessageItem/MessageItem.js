//@flow
import * as React from 'react';
import { BaseComponent, ValueSubject } from 'react_reactive_value';

const counter = new ValueSubject(44);
const counter2 = new ValueSubject(1);

setInterval(() => {
    counter.next(counter.getValue() + 1);
}, 2000);

setInterval(() => {
    counter2.next(counter2.getValue() + 1);
}, 3000);

type PropsType = {|
    className: string,
    messageId: string,
|};

export default class MessageItem extends BaseComponent<PropsType> {

    counter$ = counter.asObservable();
    char$ = counter2.asObservable()
        .map(count => '.'.repeat(Math.min(count, 30)));

    render() {
        const { className, messageId } = this.props;
        const counter = this.getValue$(this.counter$);
        const char = this.getValue$(this.char$);

        return (
            <div className={className}>
                <p>{ messageId } { counter }</p>
                <p>{char}</p>
            </div>
        );
    }
}

