//@flow

import * as React from 'react';

import { Value, Computed, ValueDebounce } from 'computed-values';
import { BaseComponent } from '../BaseComponent';

import Store from './Store';

type PropsType = {|
    className: string
|};

class Autocomplete extends BaseComponent<PropsType> {
    input: ValueDebounce<string> = new ValueDebounce('', 1000);
    _inputHighlight = new Value('');
    direction = new Value(false);

    inputHighlight = this._inputHighlight.asComputed();
    currentList = this.input.asComputed()
        .switchMap(input => Store.getList(input));

    currentListWithDirection = Computed.combine(
        this.currentList,
        this.direction.asComputed(),
        (list, direction) => {
            if (direction === false) {
                return list;
            }

            if (list) {
                const clone = list.concat([]);
                clone.reverse();
                return clone;
            }

            return list;
        }
    );

    _onChange = (event: SyntheticEvent<>) => {
        const target = event.target;
        if (target instanceof HTMLInputElement) {
            console.info('input', target.value);
            this.input.setValue(target.value);
        }
    }

    _onChangeHighlight = (event: SyntheticEvent<>) => {
        const target = event.target;
        if (target instanceof HTMLInputElement) {
            this._inputHighlight.setValue(target.value);
        }
    };

    _onChangeDirection = (event: SyntheticEvent<>) => {
        const target = event.target;
        if (target instanceof HTMLInputElement) {
            this.direction.setValue(target.checked);
        }
    }

    render() {
        const { className } = this.props;
        
        return (
            <div className={className}>
                <div className="Autocomplete__header">
                    <div className="Autocomplete__header_item">
                        <span className="Autocomplete__header_label">Search:</span> 
                        <input onChange={this._onChange} />
                    </div>
                    <div className="Autocomplete__header_item">
                        <span className="Autocomplete__header_label">Highlight:</span>
                        <input onChange={this._onChangeHighlight} />
                    </div>
                    <div className="Autocomplete__header_item">
                        <span className="Autocomplete__header_label">Display in reverse order:</span>
                        <input type="checkbox" onChange={this._onChangeDirection} />
                    </div>
                </div>
                { this._renderList() }
            </div>
        );
    }

    _renderList = () => {
        const list = this.getFromComputed(this.currentListWithDirection);
        
        if (list === null) {
            return (
                <div>
                    Wczytywanie ...
                </div>
            );
        }

        return (
            <div>
                { list.map(item => (
                    <AutocompleteListItem
                        key={item}
                        value={item}
                        highlight={this.inputHighlight}
                    />
                ))}
            </div>
        );
    }
}

type PropsListType = {|
    value: string,
    highlight: Computed<string>,
|};

const joinArr = <T>(list: Array<T>, separator: T): Array<T> => {
    const out = [];
    for (const item of list) {
        out.push(item);
        out.push(separator);
    }

    out.pop();
    return out;
};

class AutocompleteListItem extends BaseComponent<PropsListType> {
    chunks$: Computed<Array<[string, bool]>>;

    constructor(props: PropsListType) {
        super(props);

        const value$: Computed<string> = this.propsComputed
            .map(props => props.value)
            .distinctUntilChanged();

        const highlight$: Computed<string> = this.propsComputed
            .switchMap(props => props.highlight)
            .distinctUntilChanged();

        this.chunks$ = Computed.combine(
            value$,
            highlight$,
            (value, highlight) => {
                if (highlight === '') {
                    return [[value, false]];   
                };

                const chunks = value.split(highlight).map(word => [word, false]);
                
                return joinArr(chunks, [highlight, true]);
            }
        ).distinctUntilChanged((list1, list2): bool => {
            if (list1.length !== list2.length) {
                return false;
            }

            for (let i=0; i<list1.length; i++) {
                const [word1, high1] = list1[i];
                const [word2, high2] = list2[i];

                if (word1 !== word2) {
                    return false;
                }

                if (high1 !== high2) {
                    return false;
                }
            }

            return true;
        });
    }

    render() {
        const list = this.getFromComputed(this.chunks$);

        const out = [];

        for (const [index, [word, isHighlight]] of list.entries()) {
            if (isHighlight) {
                out.push(<div key={index} className="Autocomplite__highlight">{word}</div>);
            } else {
                out.push(<div key={index}>{word}</div>);
            }
        }

        return (
            <div className="Autocomplite__result_item">
                {
                    React.createElement(
                        React.Fragment,
                        {},
                        ...out
                    )
                }
            </div>
        );
    }
}

export default Autocomplete;
