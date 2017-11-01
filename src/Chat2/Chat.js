//@flow

import * as React from 'react';
import GraphPureComponent from '../Graph/GraphPureComponent';

type PropsType = {|
    className: string,
|};

type StateType = {|
    nick: string,
    message: string,
    errorMessage: string | null,
|};

export default class Chat extends GraphPureComponent<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            nick: '',
            message: '',
            errorMessage: null
        };
    }

    _onChangeNick = (event: SyntheticEvent<>) => {
        if (event.target instanceof HTMLInputElement) {
            this.setState({
                nick: event.target.value,
                errorMessage: null
            });
        }
    }

    _onChangeTextarea = (event: SyntheticEvent<>) => {
        if (event.target instanceof HTMLTextAreaElement) {
            this.setState({
                message: event.target.value,
                errorMessage: null
            });
        }
    }

    _onSend = () => {
        const { nick, message } = this.state;

        if (nick.length < 1) {
            this.setState({ errorMessage: 'Type in the nick' });
            return;
        }

        if (message.length < 1) {
            this.setState({ errorMessage: 'Type in the message' });
            return;
        }

        this.graph.chat.send(nick, message);
        this.setState({ message: '' });
    };

    render() {
        const { nick, message } = this.state;

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
