//@flow

import * as React from 'react';
import logo from './logo.svg';
import './App.css';

import BaseComponent from './Lib/BaseComponent';
import { ValueSubject } from './Lib/Reactive';


const thread$ = new ValueSubject(3);
const message$ = new ValueSubject(44);

setInterval(() => {
	const current = message$.getValue();
	message$.next(current + 1);
}, 2000);


type PropsType = {
    messageId: string,
};

class MessageItem extends BaseComponent<PropsType> {                        //dziedziczenie dostarcza typy - dekorator funkcjonalność
    ddd = 121;

    render() {
        const { messageId } = this.props;
        const message = this.getValue$(message$.asObservable());

        if (message) {
            return (
                <div>
                    model tenże { messageId } { this.ddd } { message }
                </div>
            );
        }

        return (
            <div>
                brak - { messageId } { this.ddd }
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
