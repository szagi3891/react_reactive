//@flow
import { ValueObservable } from 'react_reactive_value';
import Graph from './Graph';
import ChatBind from './GraphBranch/ChatBind';
import ChatMessageBind from './GraphBranch/ChatMessageBind';

export default class GraphBind {

    _graph: Graph;
    _getValue$: <T>(ValueObservable<T>) => T;

    constructor(graph: Graph, getValue$: <T>(ValueObservable<T>) => T) {
        this._graph = graph;
        this._getValue$ = getValue$;
    }

    get chat(): ChatBind {
        return new ChatBind(this._graph.chatList, this._getValue$);
    }

    get chatMessage(): ChatMessageBind {
        return new ChatMessageBind(this._graph.chatMessage, this._getValue$);
    }
}
