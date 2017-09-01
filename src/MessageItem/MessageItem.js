//@flow
import * as React from 'react';
import BaseComponent from '../Lib/BaseComponent';
import { ValueSubject } from '../Lib/Reactive';

const counter$ = new ValueSubject(44);
const counter2$ = new ValueSubject(1);

const char$ = counter2$.asObservable().map(count => '.'.repeat(Math.min(count, 30)));

setInterval(() => {
    counter$.next(counter$.getValue() + 1);
}, 2000);

setInterval(() => {
    counter2$.next(counter2$.getValue() + 1);
}, 3000);

type PropsType = {|
    className: string,
    messageId: string,
|};

							//dziedziczenie dostarcza funkcję getValue$ - która mapuje obserwator na wartosć
export default class MessageItem extends BaseComponent<PropsType> {
    render() {
        const { className, messageId } = this.props;
        const counter = this.getValue$(counter$.asObservable());
        const char = this.getValue$(char$);

        return (
            <div className={className}>
                <p>model tenże { messageId } { counter }</p>
                <p>==> {char}</p>
            </div>
        );
    }
}
