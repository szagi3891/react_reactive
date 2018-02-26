//@flow
import * as React from 'react';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';

const appState = observable({
    timer: 0,
    resetTimer: () => {
        appState.timer = 0;    
    }
});

/*
setInterval(action(() => {
    appState.timer += 1;
}), 1000);
*/

type PropsType = {|
    className: string,
    messageId: string,
|};

@observer
export default class MessageItem extends React.Component<PropsType> {
    render() {
        const { className, messageId } = this.props;

        const timer = appState.timer;

        return (
            <div className={className}>
                <p>{ messageId }</p>
                <p onClick={appState.resetTimer}>{ timer }</p>
            </div>
        );
    }
}
