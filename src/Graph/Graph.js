//@flow

import ChatMessageGraph from './GraphBranch/ChatMessageGraph';
import ChatGraph from './GraphBranch/ChatGraph';

export default class Graph {

    chatList: ChatGraph;
    //chatMessage: ChatMessageGraph;

    constructor() {
        this.chatList = new ChatGraph();
        //this.chatMessage = new ChatMessageGraph();
    }
}
