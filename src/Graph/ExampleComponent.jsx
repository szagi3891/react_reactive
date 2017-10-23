//@flow
import * as React from 'react';
import { BaseComponent } from 'react_reactive_value';
import graph from 'AppGraph';

type PropsType = {|
    idThread: string
|};

class LastMessage extends BaseComponent<PropsType> {
    render(): React.Node {

        const lastMessage: MessageModel | null = this.getValue$(graph.thread.getLastMessage(this.props.idThread));

        if (lastMessage) {
            return (
                <div>
                    <div>Last message: lastMessage.body</div>
                    <div>{ this._renderAuthor(lastMessage) }</div>
                </div>
            )
        }

        return null;
    }

    _renderAuthor = (lastMessage: MessageModel): React.Node => {
        /*
        const author: UserModel | null = this.getValue$(graph.user.get$(lastMessage.author));

        if (author) {
            return (
                <div>Author: { author.name } </div>
            );
        }

        return null;
        */
    }
}