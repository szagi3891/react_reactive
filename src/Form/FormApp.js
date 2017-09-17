//@flow
import * as React from 'react';
import cx from 'classnames';
import BaseComponent from '../Lib/BaseComponent';
import { Subject } from '../Lib/Reactive';
import FormGroupState from './FormGroupState';
import FormGroup from './FormGroup';

import './FormApp.css';

type PropsType = {|
    className: string,
    state: FormGroupState,
    onSubmit: (data: Array<string>) => void,
|};

export default class FormApp extends BaseComponent<PropsType> {

    send: Subject<void> = new Subject();
    dataSubmit$ = this.send.asObservable()
        .withLatestFrom2(
            this.getProps$().switchMap(props => props.state.data$),
            this.getProps$()
        );

    constructor(props: PropsType) {
        super(props);

        this.subscribe$(
            this.dataSubmit$
                .do(([click, data, props]) => {
                    if (data !== null) {
                        const { onSubmit } = props;
                        onSubmit(data);
                    }
                })
        );
    }


    onSend = () => {
        this.send.next();
    }

    render() {
        const { className, state } = this.props;
        const data = this.getValue$(state.data$);

        const submitClassName = cx('FormSubmit', {
            'FormSubmit--disable': data === null
        });

        return (
            <div className={className}>
                <FormGroup
                    state={state}
                />

                <div className={submitClassName}>
                    <div className="FormSubmitButton" onClick={this.onSend}>
                        Wyślij
                    </div>
                </div>
            </div>
        );
    }
}

