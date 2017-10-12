//@flow

import GlobalStorage from './GlobalStorage';
import ThreadBranch from './GraphBranch/ThreadBranch';
import MessageBranch from './GraphBranch/MessageBranch';

export default class Graph {

    thread: ThreadBranch;
    message: MessageBranch;

    constructor(globalStorage: GlobalStorage) {
        this.message = new MessageBranch(globalStorage);
        this.thread = new ThreadBranch(globalStorage, this.message);
    }
}
