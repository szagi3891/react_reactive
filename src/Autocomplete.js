//@flow

import * as React from 'react';

import BaseComponent from './Lib/BaseComponent';
import { ValueSubject } from './Lib/Reactive';

import Store from './Store';

class Autocomplete extends BaseComponent<{}> {
    input = new ValueSubject('');

    currentList = this.input.asObservable()
        .debounceTime(1000)
        .switchMapValue(input => Store.getList(input));

    _onChange = (event: Object) => {
        console.info('input', event.target.value);
        this.input.next(event.target.value);
    }

    render() {
        return (
            <div>
                <input onChange={this._onChange} />
                { this._renderList() }
            </div>
        );
    }

    _renderList = () => {

        const list = this.getValue$(this.currentList);
        
        if (list === null) {
            return (
                <div>
                    Wczytywanie ...
                </div>
            );
        }

        return (
            <div>
                { list.map(item => <div key={item}>{item}</div>)}
            </div>
        );
    }
}

export default Autocomplete;
