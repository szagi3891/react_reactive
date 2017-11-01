//@flow

import GraphRenderManager from './GraphRenderManager';
import ChatMessageGraph from './GraphBranch/ChatMessageGraph';
import ChatGraph from './GraphBranch/ChatGraph';

export default class Graph {

    _graphRenderManager: GraphRenderManager
    chatMessage: ChatMessageGraph;
    chat: ChatGraph;

    constructor(graphRenderManager: GraphRenderManager) {
        this._graphRenderManager = graphRenderManager;
        this.chatMessage = new ChatMessageGraph(graphRenderManager);
        this.chat = new ChatGraph(graphRenderManager, this.chatMessage);
    }
}
