//@flow
import { ValueObservable } from 'react_reactive_value';
import Graph from './Graph';
import ChatGraphBind from './GraphBranch/ChatGraphBind';

export default class GraphBind {

    _graph: Graph;
    _getValue$: <T>(ValueObservable<T>) => T;

    constructor(graph: Graph, getValue$: <T>(ValueObservable<T>) => T) {
        this._graph = graph;
        this._getValue$ = getValue$;
    }

    getValue$<T>(value: ValueObservable<T>): T {
        return this._getValue$(value);
    }

    get chat(): ChatGraphBind {
        return new ChatGraphBind(this._graph.chatList, this._getValue$);
    }

    /*
    get chatMessage() {
        //chatMessage: ChatMessageGraph;
    }
    */
}
