//@flow

import * as React from 'react';
import './App.css';

import MessageItem from './MessageItem/MessageItem';
import Autocomplete from './Autocomplete/Autocomplete';

import Form from './Form/Form';
import FormInputState from './Form/FormInputState';
import FormState from './Form/FormState';
import Validators from './Form/Validators';

const onSubmit = (form: Array<string>) => {
    console.info('Wysyłam poprawnie zwalidowane dane formularza', form);
};

class App extends React.Component<{||}> {

    formState = new FormState([{
        key: 'field1',
        label: 'Wprowadź datę bitwy pod Grunwaldem',
        state: new FormInputState('Oczekiwano poprawnej daty', Validators.isGrunwald)
    }, {
        key: 'field2',
        label: 'Wprowadź wiek jakiśtam',
        state: new FormInputState('Oczekiwano poprawnego wieku', Validators.isNumber)
    }, {
        key: 'field3',
        label: 'Wprowadź liczbę szesnastkową',
        state: new FormInputState('Oczekiwano hasła do biosu', Validators.isHex)
    }]);

    formState2 = new FormState([{
        key: 'field1',
        label: 'Wprowadź datę bitwy pod Grunwaldem',
        state: new FormInputState('Oczekiwano poprawnej daty', Validators.isGrunwald)
    }, {
        key: 'field2',
        label: 'Wprowadź wiek jakiśtam',
        state: new FormInputState('Oczekiwano poprawnego wieku', Validators.isNumber)
    }, {
        key: 'field3',
        label: 'Wprowadź liczbę szesnastkową',
        state: new FormInputState('Oczekiwano hasła do biosu', Validators.isHex)
    }, {
        key: 'field4',
        label: 'Wprowadź liczbę szesnastkową',
        state: new FormInputState('Oczekiwano hasła do biosu', Validators.isHex)
    }]);

    render() {
        return (
            <div className="App">
                <MessageItem messageId="aaazzzddd1234567890" className="App__border" />
                <Autocomplete className="App__border" />
                <Form
                    className="App__border"
                    formState={this.formState}
                    onSubmit={onSubmit}
                />
                <Form
                    className="App__border"
                    formState={this.formState2}
                    onSubmit={onSubmit}
                />
            </div>
        );
    }
}

export default App;
