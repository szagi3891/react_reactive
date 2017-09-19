//@flow

import * as React from 'react';
import cx from 'classnames';
import './App.css';

import MessageItem from './MessageItem/MessageItem';
import Chat from './Chat/Chat';
import Autocomplete from './Autocomplete/Autocomplete';
import { BaseComponent, ValueSubject } from 'react_reactive_value';
import Tab from './Tab';
import FormApp from './Form/FormApp';
import FormInputState from './Form/FormInputState';
import FormGroupState from './Form/FormGroupState';
import Validators from './Form/Validators';
import FormWizzardMain from './FormWizzard/FormWizzardMain';
import FormWizzardMainState from './FormWizzard/FormWizzardMainState';

class App extends BaseComponent<{||}> {
    formState1 = new FormGroupState([{
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

    formState2 = new FormGroupState([{
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

    _onSubmit1 = (data: Array<string> | null) => {
        if (data !== null) {
            console.info('dane z pierwszego formularza', data);
        }
    };

    _onSubmit2 = (data: Array<string> | null) => {
        if (data !== null) {
            console.info('dane z pierwszego formularza', data);
        }
    };

    formState3 = new FormGroupState([{
        key: 'field1',
        label: 'Wprowadź datę bitwy pod Grunwaldem',
        state: new FormInputState('Oczekiwano poprawnej daty', Validators.isGrunwald)
    }]);

    formWizzardState = new FormWizzardMainState(this.formState1, this.formState2, this.formState3);

    tab: ValueSubject<string> = new ValueSubject('formWizzard');
    tab$ = this.tab.asObservable();

    _config = [{
        key: 'formWizzard',
        label: 'Form wizzard',
        render: () => (
            <FormWizzardMain
                className="App__border"
                state={this.formWizzardState}
            />
        )
    }, {
        key: 'chat',
        label: 'Chat',
        render: () => <Chat className="App__border" />
    }, {
        key: 'autocomplete',
        label: 'Autocomplete',
        render: () => <Autocomplete className="App__border" />
    }, {
        key: 'podstawowy',
        label: 'Podstawowy',
        render: () => <MessageItem messageId="aaazzzddd1234567890" className="App__border" />
    }, {
        key: 'form1',
        label: 'Formularz 1',
        render: () => (
            <FormApp
                className="App__border"
                state={this.formState1}
                onSubmit={this._onSubmit1}
            />
        )
    }, {
        key: 'form2',
        label: 'Formularz 2',
        render: () => (
            <FormApp
                className="App__border"
                state={this.formState2}
                onSubmit={this._onSubmit2}
            />
        )
    }];

    _getTabClass = (tab: string) => {
        const currentTab = this.getValue$(this.tab$);
        return cx('Menu__item', {
            'Menu__item--select': currentTab === tab
        });
    }

    _tabClick = (newTab: string) => {
        this.tab.next(newTab);
    }

    _renderMenu = () => (
        <div className="Menu">
            { this._config.map(item => (
                <Tab
                    key={item.key}
                    className={this._getTabClass(item.key)}
                    value={item.key}
                    onClick={this._tabClick}
                >
                    { item.label }
                </Tab>
            ))}
        </div>
    );

    _renderBody = (currentTab: string) => (
        <div>
            { this._config.map(item => {
                if (item.key === currentTab) {
                    const Render = item.render;
                    return <Render key={item.key} />;
                }
                
                return null;
            })}
        </div>
    );

    render() {
        const currentTab = this.getValue$(this.tab$);

        return (
            <div className="App">
                { this._renderMenu() }
                { this._renderBody(currentTab) }
            </div>
        );
    }
}

export default App;
