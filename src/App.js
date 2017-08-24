//@flow

import * as React from 'react';
import logo from './logo.svg';
import './App.css';

import BaseComponent from './Lib/BaseComponent';
import { ValueSubject } from './Lib/Reactive';


const counter$ = new ValueSubject(44);
const counter2$ = new ValueSubject(1);

const char$ = counter2$.asObservable().map(count => '.'.repeat(Math.min(count, 30)));

setInterval(() => {
    counter$.next(counter$.getValue() + 1);
}, 2000);

setInterval(() => {
    counter2$.next(counter2$.getValue() + 1);
}, 3000);

type PropsType = {
    messageId: string,
};

							//dziedziczenie dostarcza funkcję getValue$ - która mapuje obserwator na wartosć
class MessageItem extends BaseComponent<PropsType> {
    render() {
        const { messageId } = this.props;
        const counter = this.getValue$(counter$.asObservable());
        const char = this.getValue$(char$);

        return (
            <div>
                <p>model tenże { messageId } { counter }</p>
                <p>==> {char}</p>
            </div>
        );
    }
}


class App extends React.Component<{}> {
    render() {
        return (
            <div className="App">
                <MessageItem messageId="aaazzzddd1234567890" />
            </div>
        );
    }
}

export default App;
