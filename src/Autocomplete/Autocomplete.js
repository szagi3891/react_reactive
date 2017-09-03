//@flow

import * as React from 'react';

import BaseComponent from '../Lib/BaseComponent';
import { ValueSubject } from '../Lib/Reactive';

import Store from './Store';

type PropsType = {|
    className: string
|};

class Autocomplete extends BaseComponent<PropsType> {
    input = new ValueSubject('');

    currentList = this.input.asObservable()
        .debounceTime(1000)
        .switchMap(input => Store.getList(input));

    _onChange = (event: Object) => {
        console.info('input', event.target.value);
        this.input.next(event.target.value);
    }

    render() {
        const { className } = this.props;
        
        return (
            <div className={className}>
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
            <AutocompleteList list={list} />
        );
    }
}

type PropsListType = {|
    list: Array<string>
|};

class AutocompleteList extends BaseComponent<PropsListType> {
    render() {
        const { list } = this.props;

        return (
            <div>
                { list.map(item => <div key={item}>{item}</div>)}
            </div>
        );
    }
}

export default Autocomplete;
