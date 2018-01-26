//@flow
import * as React from 'react';
import { Value, Computed } from 'computed-values';
import { BaseComponent } from '../BaseComponent';

type PropsType = {||};

export default class extends BaseComponent<PropsType> {
    _visitedTrigger: Value<bool>;
    _visitedOverlay: Value<bool>;
    _overlayShow: Computed<bool>;

    constructor(props: PropsType) {
        super(props);

        this._visitedTrigger = new Value(false);
        this._visitedOverlay = new Value(false);

        this._overlayShow = Computed.combine3(
            this._visitedTrigger.asComputed(),
            this._visitedTrigger.asComputed().delay(500),
            this._visitedOverlay.asComputed(),
            (trigger: bool, triggerDelay: bool, overlay: bool): bool => {
                return trigger || triggerDelay || overlay;
            }
        ).debounceTime(200);
    }

    render(): React.Node {
        return (
            <div>
                { this._renderTrigger() }
                <br/><br/><br/>
                { this._renderOverlay() }
            </div>
        );
    }

    _triggerEnter = () => {
        this._visitedTrigger.setValue(true);
    }

    _triggerLeave = () => {
        this._visitedTrigger.setValue(false);
    }

    _renderTrigger(): React.Node {
        const style = {
            backgroundColor: 'green',
            height: '50px'
        };

        return (
            <div
                style={style}
                onMouseEnter={this._triggerEnter}
                onMouseLeave={this._triggerLeave}
            >
                Trigger
            </div>
        );
    }

    _overlayEnter = () => {
        this._visitedOverlay.setValue(true);
    }

    _overlayLeave = () => {
        this._visitedOverlay.setValue(false);
    }

    _renderOverlay(): React.Node {
        const isShow = this.getFromComputed(this._overlayShow);
        console.info('isShow', isShow);
        const style = {
            backgroundColor: 'red',
            width: '300px',
            height: '200px',
            display: isShow ? 'block' : 'none'
        };

        return (
            <div
                style={style}
                onMouseEnter={this._overlayEnter}
                onMouseLeave={this._overlayLeave}
            >
                Trigger
            </div>
        );
    }
}