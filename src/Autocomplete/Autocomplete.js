//@flow

import * as React from 'react';

import { Value, Computed } from 'computed-values';
import { BaseComponent } from '../BaseComponent';

import Store from './Store';

type PropsType = {|
    className: string
|};

class Autocomplete extends BaseComponent<PropsType> {
    input = new Value('');
    inputHighlight = new Value('');
    direction = new Value(false);

    currentList = this.input.asComputed()
        .debounceTime(1000)
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
            this.inputHighlight.setValue(target.value);
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
                        highlight={this.inputHighlight.asComputed()}
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

class AutocompleteListItem extends BaseComponent<PropsListType> {
    chunks$: Computed<[Array<string>, string]>;

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
                    return [[value], highlight]    
                };

                return [value.split(highlight), highlight]
            }
        );
    }

    render() {
        const [chunks, highlight] = this.getFromComputed(this.chunks$);

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
