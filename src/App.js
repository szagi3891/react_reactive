//@flow

import * as React from 'react';
import cx from 'classnames';
import './App.css';

import MessageItem from './MessageItem/MessageItem';
import Autocomplete from './Autocomplete/Autocomplete';
import { ValueSubject } from './Lib/Reactive';
import BaseComponent from './Lib/BaseComponent';
import Tab from './Tab';
import Form from './Form/Form';
import FormInputState from './Form/FormInputState';
import FormState from './Form/FormState';
import Validators from './Form/Validators';

class App extends BaseComponent<{||}> {
    tab: ValueSubject<string> = new ValueSubject('tab1');
    tab$ = this.tab.asObservable();

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
    }, {
        key: 'field5',
        label: 'Wprowadź cokolwiek',
        state: new FormInputState('Oczekiwano liczby 42', Validators.is42)
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

    _getTabClass = (tab: string) => {
        const currentTab = this.getValue$(this.tab$);
        return cx('Menu__item', {
            'Menu__item--select': currentTab === tab
        });
    }

    _tabClick = (newTab: string) => {
        this.tab.next(newTab);
    }

    render() {
        const currentTab = this.getValue$(this.tab$);

        return (
            <div className="App">
                <div className="Menu">
                    <Tab className={this._getTabClass('tab1')} value="tab1" onClick={this._tabClick}>Podstawowy</Tab>
                    <Tab className={this._getTabClass('tab2')} value="tab2" onClick={this._tabClick}>Autocomplete</Tab>
                    <Tab className={this._getTabClass('tab3')} value="tab3" onClick={this._tabClick}>Formularz 1</Tab>
                    <Tab className={this._getTabClass('tab4')} value="tab4" onClick={this._tabClick}>Formularz 2</Tab>
                </div>

                { currentTab === 'tab1' ? (
                    <MessageItem messageId="aaazzzddd1234567890" className="App__border" />
                ) : null }

                { currentTab === 'tab2' ? (
                    <Autocomplete className="App__border" />
                ) : null }

                { currentTab === 'tab3' ? (
                    <Form
                        className="App__border"
                        formState={this.formState}
                    />
                ) : null }

                { currentTab === 'tab4' ? (
                    <Form
                        className="App__border"
                        formState={this.formState2}
                    />
                ) : null }
            </div>
        );
    }
}

export default App;
