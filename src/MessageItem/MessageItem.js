//@flow
import * as React from 'react';
import { BaseComponent, ValueSubject } from 'react_reactive_value';

import { Value } from '../Value';

const counter8 = new Value(44);

const counter9 = counter8.asComputed().map(value => value + 1);

const counter10 = counter9.map(value => `dsadsa ${value}`);

const connection = counter10.connect(() => {
    console.info('TRZEBA ODŚWIEŻYĆ WIDOK');
});

console.info('value ==>', connection.getValue());

counter8.setValue(334444);

console.info('value ==>', connection.getValue());

counter8.setValue(6);


console.info('value ==>', connection.getValue());



const counter = new ValueSubject(44);
const counter2 = new ValueSubject(1);

setInterval(() => {
//    counter.update(prevValue => prevValue + 1);
    counter.update(prevValue => {
        counter2.update(prevValue => prevValue);
        return prevValue + 1;
    });
}, 2000);

setInterval(() => {
    counter2.update(prevValue => prevValue + 1);
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

/*
const counter = new ValueSubject(44);
const counter2 = new ValueSubject(1);

setInterval(() => {
//    counter.update(prevValue => prevValue + 1);
    counter.update(prevValue => {
        counter2.update(prevValue => prevValue);
        return prevValue + 1;
    });
}, 2000);

setInterval(() => {
    counter2.update(prevValue => prevValue + 1);
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
*/