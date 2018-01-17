//@flow

import * as React from 'react';
import { Value } from 'computed-values';

import { BaseComponent } from '../BaseComponent';
import { database } from '../Graph/GraphBranch/firebase';

const messages = database.ref('rxjs-demo');

const nick = new Value('');
const textarea = new Value('');
const sending = new Value(false);
const online = new Value(true);

type MessageItemType = {|
    id: string,
    nick: string,
    message: string,
|};

const chat: Value<Array<MessageItemType>> = new Value([]);

messages.on('child_added', function(messageItem) {
    chat.update(currentList => {
        const messageKey = messageItem.key;
        const messageVal = messageItem.val();
        const message = {
            id: messageKey,
            nick: messageVal.nick,
            message: messageVal.message
        }
        currentList.push(message);
        return currentList;
    });
});

database.ref(".info/connected").on("value", function(snap) {
    online.setValue(snap.val());
});

messages.on('child_changed', function(data) {
    console.info('child_changed', data, data.val());
});

messages.on('child_removed', function(data) {
    console.info('child_removed', data, data.val());
});

type PropsType = {|
    className: string,
|};

export default class Chat extends BaseComponent<PropsType> {

    _onChangeNick = (event: Object) => {
        nick.setValue(event.target.value);
    }

    _onChangeTextarea = (event: Object) => {
        textarea.setValue(event.target.value);
    }

    _onSend = () => {
        const nickValue = nick.getValue();
        const textareaValue = textarea.getValue();

        if (nickValue.length < 1) {
            alert('Type in the nick');
            return;
        }

        if (textareaValue.length < 1) {
            alert('Type in the message');
            return;
        }

        sending.setValue(true);
        textarea.setValue('');

        messages.push({
            nick: nickValue,
            message: textareaValue
        }).then((aaa) => {
            console.info(`Message send: ${textareaValue}`);
            sending.setValue(false);
        }).catch((error: Object) => {
            console.error(error);
            sending.setValue(false);
        });
    }

    render() {
        const nickValue = this.getFromComputed(nick.asComputed());
        const textareaValue = this.getFromComputed(textarea.asComputed());
        const sendingValue = this.getFromComputed(sending.asComputed());

        return (
            <div className="Chat__wrapper">
                { this._renderNetworkStatus() }

                <div>
                    <div className="Chat_InputGroup">
                        <div className="Chat_InputLabel">Nick:</div>
                        <div className="Chat_InputBox">
                            <input className="" value={nickValue} onChange={this._onChangeNick}/>
                        </div>
                    </div>

                    <div className="Chat_InputGroup">
                        <div className="Chat_InputLabel">
                            Message:
                        </div>
                        <div className="Chat_InputBox">
                            <textarea className="" value={textareaValue} onChange={this._onChangeTextarea} />
                        </div>
                    </div>

                    <div>
                        <button onClick={this._onSend}>Send</button>
                    </div>
                </div>
                { this._renderList() }
                { sendingValue ? <div className="Chat__sending">Sending ...</div> : null }
            </div>
        );
    }

    _renderNetworkStatus = () => {
        const onlineValue = this.getFromComputed(online.asComputed());
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
        const list = this.getFromComputed(chat.asComputed()).concat().reverse();
        return (
            <div className="Chat__list App__border">
                { list.map(item => this._renderListItem(item)) }
            </div>
        );
    }

    _renderListItem(item: MessageItemType) {
        return (
            <div className="Chat__message" key={item.id}>
                <div className="Chat__nick">{item.nick}:</div>
                <div>{item.message}</div>
            </div>
        )
    }
}
