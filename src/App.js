//@flow

import * as React from 'react';
import cx from 'classnames';
import './App.css';

import MessageItem from './MessageItem/MessageItem';
import Chat from './Chat/Chat';
import Chat2 from './Chat2/Chat';
import Autocomplete from './Autocomplete/Autocomplete';
import { Value } from 'computed-values';
import { BaseComponent } from './BaseComponent';
import Tab from './Tab';
import FormApp from './Form/FormApp';
import FormInputState from './Form/FormInputState';
import FormGroupState from './Form/FormGroupState';
import Validators from './Form/Validators';
import FormWizzardMain from './FormWizzard/FormWizzardMain';
import FormWizzardMainState from './FormWizzard/FormWizzardMainState';
//simport Overlay from './Overlay/Overlay';

class App extends BaseComponent<{||}> {
    formState1 = new FormGroupState([{
        key: 'field1',
        label: 'Enter the number 1410',
        state: new FormInputState('Wrong value', Validators.isGrunwald)
    }, {
        key: 'field2',
        label: 'Input some number',
        state: new FormInputState('Wrong number', Validators.isNumber)
    }, {
        key: 'field3',
        label: 'Enter the hexadecimal value',
        state: new FormInputState('Wrong hexadecimal value', Validators.isHex)
    }]);

    formState2 = new FormGroupState([{
        key: 'field1',
        label: 'Enter the number 1410',
        state: new FormInputState('Wrong value', Validators.isGrunwald)
    }, {
        key: 'field2',
        label: 'Input some number',
        state: new FormInputState('Enter the number', Validators.isNumber)
    }, {
        key: 'field3',
        label: 'Enter the hexadecimal value',
        state: new FormInputState('Wrong hexadecimal value', Validators.isHex)
    }, {
        key: 'field4',
        label: 'Enter the hexadecimal value',
        state: new FormInputState('Wrong hexadecimal value', Validators.isHex)
    }, {
        key: 'field5',
        label: 'Enter the number 42',
        state: new FormInputState('Wrong value', Validators.is42)
    }]);

    _onSubmit1 = (data: Array<string> | null) => {
        if (data !== null) {
            console.info('FormData1', data);
        }
    };

    _onSubmit2 = (data: Array<string> | null) => {
        if (data !== null) {
            console.info('FormData2', data);
        }
    };

    formState3 = new FormGroupState([{
        key: 'field1',
        label: 'Enter the number 1410',
        state: new FormInputState('Wrong value', Validators.isGrunwald)
    }]);

    formWizzardState = new FormWizzardMainState([this.formState1, this.formState2, this.formState3]);

    tab: Value<string> = new Value('formWizzard');
    tab$ = this.tab.asComputed();

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
        key: 'chat2',
        label: 'Chat2',
        render: () => <Chat2 className="App__border" />
    }, {
        key: 'autocomplete',
        label: 'Autocomplete',
        render: () => <Autocomplete className="App__border" />
    }, {
        key: 'podstawowy',
        label: 'Simple timer',
        render: () => <MessageItem messageId="someIdExample" className="App__border" />
    }, {
        key: 'form1',
        label: 'Form 1',
        render: () => (
            <FormApp
                className="App__border"
                state={this.formState1}
                onSubmit={this._onSubmit1}
            />
        )
    }, {
        key: 'form2',
        label: 'Form 2',
        render: () => (
            <FormApp
                className="App__border"
                state={this.formState2}
                onSubmit={this._onSubmit2}
            />
        )
    /*
    },{
        key: 'overlay',
        label: 'Overlay',
        render: () => <Overlay/>
    */
    }];

    _getTabClass = (tab: string): string => {
        const currentTab = this.getFromComputed(this.tab$);
        return cx('Menu__item', {
            'Menu__item--select': currentTab === tab
        });
    }

    _tabClick = (newTab: string) => {
        this.tab.setValue(newTab);
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
        const currentTab = this.getFromComputed(this.tab$);

        return (
            <div className="App">
                { this._renderMenu() }
                { this._renderBody(currentTab) }
            </div>
        );
    }
}

export default App;
