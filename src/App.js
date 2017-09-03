//@flow

import * as React from 'react';
import './App.css';

import MessageItem from './MessageItem/MessageItem';
import Autocomplete from './Autocomplete/Autocomplete';

import BaseComponent from './Lib/BaseComponent';
import Form from './Form/Form';
import FormInputState from './Form/FormInputState';
import FormState from './Form/FormState';
import Validators from './Form/Validators';

const onSubmit = (form: Array<string>) => {
    console.info('Wysyłam poprawnie zwalidowane dane formularza', form);
};

class App extends BaseComponent<{||}> {

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

    constructor(props: {||}) {
        super(props);

        this.subscribe$(
            this.formState.submitData$
                .do(data => {
                    console.info('dane z pierwszego formularza', data);
                })
        );

        this.subscribe$(
            this.formState2.submitData$
                .do(data => {
                    console.info('dane z drugiego formularza', data);
                })
        );
    }

    render() {
        return (
            <div className="App">
                <MessageItem messageId="aaazzzddd1234567890" className="App__border" />
                <Autocomplete className="App__border" />
                <Form
                    className="App__border"
                    formState={this.formState}
                />
                <Form
                    className="App__border"
                    formState={this.formState2}
                />
            </div>
        );
    }
}

export default App;
