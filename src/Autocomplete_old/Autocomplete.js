//@flow

import * as React from 'react';

import { BaseComponent, ValueSubject, ValueObservable } from 'react_reactive_value';

import Store from './Store';

type PropsType = {|
    className: string
|};

class Autocomplete extends BaseComponent<PropsType> {
    input = new ValueSubject('');
    inputHighlight = new ValueSubject('');
    direction = new ValueSubject(false);

    currentList = this.input.asObservable()
        .debounceTime(1000)
        .switchMap(input => Store.getList(input));

    currentListWithDirection = ValueObservable.combineLatest(
        this.currentList,
        this.direction.asObservable(),
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

    _onChange = (event: Object) => {
        console.info('input', event.target.value);
        this.input.next(event.target.value);
    }

    _onChangeHighlight = (event: Object) => {
        this.inputHighlight.next(event.target.value);
    };

    _onChangeDirection = (event: Object) => {
        this.direction.next(event.target.checked);
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
        const list = this.getValue$(this.currentListWithDirection);
        
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
                        highlight={this.inputHighlight.asObservable()}
                    />
                ))}
            </div>
        );
    }
}

type PropsListType = {|
    value: string,
    highlight: ValueObservable<string>,
|};

class AutocompleteListItem extends BaseComponent<PropsListType> {
    chunks$: ValueObservable<[Array<string>, string]>;

    constructor(props: PropsListType) {
        super(props);

        const props$ = this.getProps$()

        const value$: ValueObservable<string> = props$
            .map(props => props.value)
            .distinctUntilChanged();

        const highlight$: ValueObservable<string> = props$
            .switchMap(props => props.highlight)
            .distinctUntilChanged();
        
        this.chunks$ = ValueObservable.combineLatest(
            value$,
            highlight$,
            (value, highlight) => {
                if (highlight === '') {
                    return [[value], highlight]    
                };

                return [value.split(highlight), highlight]
            }
        );
    }

    render() {
        const [chunks, highlight] = this.getValue$(this.chunks$);

        const out = [];
        for (const [index, item] of chunks.entries()) {
            if (index !== 0) {
                out.push(<div key={`${highlight}_${index}`} className="Autocomplite__highlight">{highlight}</div>);
            }
            out.push(<div key={index}>{item}</div>);
        }

        return (
            <div className="Autocomplite__result_item">
                { out }
            </div>
        );
    }
}

export default Autocomplete;
