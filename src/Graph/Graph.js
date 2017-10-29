//@flow

import ChatMessageGraph from './GraphBranch/ChatMessageGraph';
import ChatGraph from './GraphBranch/ChatGraph';

export default class Graph {

    chatMessage: ChatMessageGraph;
    chatList: ChatGraph;

    constructor() {
        this.chatMessage = new ChatMessageGraph();
        this.chatList = new ChatGraph(this.chatMessage);
    }
}
