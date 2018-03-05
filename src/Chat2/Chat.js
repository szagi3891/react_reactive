//@flow

import * as React from 'react';
import PureComponent from './PureComponent';
import { Value, transaction } from 'computed-values';

type PropsType = {|
    className: string,
|};

export default class Chat extends PureComponent<PropsType> {
    nick = new Value('');
    message = new Value('');
    errorMessage: Value<string | null> = new Value(null);

    _onChangeNick = (event: SyntheticEvent<>) => {
        const target = event.target;
        if (target instanceof HTMLInputElement) {
            transaction(() => {
                this.nick.setValue(target.value);
                this.errorMessage.setValue(null);
            });
        }
    }

    _onChangeTextarea = (event: SyntheticEvent<>) => {
        if (event.target instanceof HTMLTextAreaElement) {
            const target = event.target;
            transaction(() => {
                this.message.setValue(target.value);
                this.errorMessage.setValue(null);
            });
        }
    }

    _onSend = () => {
        const nick = this.nick.getValueSnapshot();
        const message = this.message.getValueSnapshot();

        if (nick.length < 1) {
            this.errorMessage.setValue('Type in the nick');
            return;
        }

        if (message.length < 1) {
            this.errorMessage.setValue('Type in the message');
            return;
        }

        this.graph.chat.send(nick, message);
        this.errorMessage.setValue('');
        'Type in the message'
    };

    render() {
        const nick = this.nick.asComputed().value();
        const message = this.message.asComputed().value();

        return (
            <div className="Chat__wrapper">
                { this._renderNetworkStatus() }

                <div>
                    <div className="Chat_InputGroup">
                        <div className="Chat_InputLabel">Nick:</div>
                        <div className="Chat_InputBox">
                            <input className="" value={nick} onChange={this._onChangeNick}/>
                        </div>
                    </div>

                    <div className="Chat_InputGroup">
                        <div className="Chat_InputLabel">
                            Message:
                        </div>
                        <div className="Chat_InputBox">
                            <textarea className="" value={message} onChange={this._onChangeTextarea} />
                        </div>
                    </div>

                    <div>
                        <button onClick={this._onSend}>Send</button>
                    </div>
                </div>
                { this._renderList() }
                { this.graph.chat.sending ? <div className="Chat__sending">Sending ...</div> : null }
            </div>
        );
    }

    _renderNetworkStatus = () => {
        const onlineValue = this.graph.chat.online;
        if (onlineValue) {
            return (
                <div className="Chat__online">Network Online</div>
            );
        } else {
            return (
                <div className="Chat__offline">Network Offline</div>
            );
        }
    }

    _renderList() {
        const list = this.graph.chat.list;
        const reverse = list.concat().reverse();

        return (
            <div className="Chat__list App__border">
                { reverse.map(this._renderListItem) }
            </div>
        );
    }

    _renderListItem = (id: string) => {
        const item = this.graph.chatMessage.get(id);

        if (item === null) {
            return <div className="Chat__message" key={id}><i>Loading ...</i></div>;
        }

        return (
            <div className="Chat__message" key={id}>
                <div className="Chat__nick">{item.nick}:</div>
                <div>{item.message}</div>
            </div>
        )
    }
}
