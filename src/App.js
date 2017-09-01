//@flow

import * as React from 'react';
import logo from './logo.svg';
import './App.css';

import MessageItem from './MessageItem/MessageItem';
import Autocomplete from './Autocomplete/Autocomplete';

class App extends React.Component<{}> {
    render() {
        return (
            <div className="App">
                <MessageItem messageId="aaazzzddd1234567890" className="App__border" />
                <Autocomplete className="App__border" />
            </div>
        );
    }
}

export default App;
