//@flow

import * as React from 'react';

import { BaseComponent, Value, ValueComputed, combineValue } from '../Value';

import Store from './Store';

//const combineLatest = <A,B,R>(aa: ValueComputed<A>, bb: ValueComputed<B>, ())

type PropsType = {|
    className: string
|};

class Autocomplete extends BaseComponent<PropsType> {
    input = new Value('');
    inputHighlight = new Value('');
    direction = new Value(false);

                                                                        //TODO - przywrócić tą wersję
    /*
    currentList = this.input.asComputed()
        //.debounceTime(1000)                                           //TODO - do przywrócenia w innej formie
        .switchMap(input => Store.getList(input));
    */

                                                                        //TODO - tymczasowy mock
    currentList = new Value(['adsada', 'dasdas', 'aaa', 'bbb', 'zzz', 'kkk']);

    currentListWithDirection = combineValue(
        this.currentList.asComputed(),
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

    /*
    constructor(props: PropsType) {
        super(props);

        let counter = 0;
        setInterval(() => {
            this.currentList.update(prev => [...prev, `nowyyyy ${counter}`]);
            counter++;
        }, 5000);
    }
    */

    _onChange = (event: Object) => {
        console.info('input', event.target.value);
        this.input.setValue(event.target.value);
    }

    _onChangeHighlight = (event: Object) => {
        this.inputHighlight.setValue(event.target.value);
    };

    _onChangeDirection = (event: Object) => {
        this.direction.setValue(event.target.checked);
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
    highlight: ValueComputed<string>,
|};

class AutocompleteListItem extends BaseComponent<PropsListType> {
    chunks$: ValueComputed<[Array<string>, string]>;

    constructor(props: PropsListType) {
        super(props);

        const value$: ValueComputed<string> = this.propsComputed
            .map(props => props.value);
            //.distinctUntilChanged();                                      //TODO ???



        const highlight$: ValueComputed<string> = this.propsComputed
            .switch(props => props.highlight);
            //.distinctUntilChanged();                                      //TODO ???



        this.chunks$ = combineValue(
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
