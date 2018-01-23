//@flow

import ChatMessageGraph from './GraphBranch/ChatMessageGraph';
import ChatGraph from './GraphBranch/ChatGraph';

export default class Graph {

    chatMessage: ChatMessageGraph;
    chat: ChatGraph;

    constructor() {
        this.chatMessage = new ChatMessageGraph();
        this.chat = new ChatGraph(this.chatMessage);
    }
}
