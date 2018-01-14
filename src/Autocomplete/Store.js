//@flow

import { Value, ValueComputed } from '../Value';

class Store {
    _data: Map<string, Value<Array<string> | null>>;

    constructor() {
        this._data = new Map();
    }

    getList(text: string): ValueComputed<Array<string> | null> {
        const item = this._data.get(text);

        if (item) {
            return item.asComputed();
        }

        const newStream = new Value(null);

        this._data.set(text, newStream);

        this._sendRequest(text, newStream);

        return newStream.asComputed();
    }

    _sendRequest(text: string, subject: Value<Array<string> | null>) {
        if (text === '') {
            subject.setValue([]);
            return;
        }

        const url = `https://api.github.com/search/repositories?q=${text}`;

        const paramsFetch = {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }    
        };

        console.info('wykonuje request', url);

        fetch(url, paramsFetch)
            .then((response) => response.json())
            .then(resp => {
                console.info('otrzymalismy odpowiedz', resp);
                return resp.items.map(item => `${item.name} -> ${item.full_name}`)
            })
            .then(resp => {
                subject.setValue(resp);
            })
            .catch((err) => {
                console.info('fetch - error', err);
            });        
    }
}

export default new Store();
