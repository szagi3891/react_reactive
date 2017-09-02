//@flow

import * as React from 'react';
import logo from './logo.svg';
import './App.css';

import MessageItem from './MessageItem/MessageItem';
import Autocomplete from './Autocomplete/Autocomplete';
import Form from './Form/Form';
import type { FormType } from './Form/Form';

const onSubmit = (form: FormType) => {
    console.info('Wysyłam poprawnie zwalidowane dane formularza', form);
};

class App extends React.Component<{}> {
    render() {
        return (
            <div className="App">
                <MessageItem messageId="aaazzzddd1234567890" className="App__border" />
                <Autocomplete className="App__border" />
                <Form className="App__border" onSubmit={onSubmit} />
            </div>
        );
    }
}

export default App;
