//@flow

import * as React from 'react';
import firebase from 'firebase';
import { BaseComponent, Subject, ValueSubject } from 'react_reactive_value';

const config = {
    apiKey: "AIzaSyDon__hg5Iv1zi5uvMv2V5HCSGmy6NzDGE",
    authDomain: "rxczat.firebaseapp.com",
    databaseURL: "https://rxczat.firebaseio.com",
    projectId: "rxczat",
    storageBucket: "",
    messagingSenderId: "324635810240"
};

firebase.initializeApp(config);

const database = firebase.database();
const messages = database.ref('rxjs-demo');

const nick = new ValueSubject('');
const textarea = new ValueSubject('');
const sending = new ValueSubject(false);
const online = new ValueSubject(true);
const activeUser = new ValueSubject(null);

type MessageItemType = {|
    id: string,
    nick: string,
    message: string,
|};

const chat: ValueSubject<Array<MessageItemType>> = new ValueSubject([]);


messages.on('child_added', function(messageItem) {
    const currentList = chat.getValue();
    const messageKey = messageItem.key;
    const messageVal = messageItem.val();
    const message = {
        id: messageKey,
        nick: messageVal.nick,
        message: messageVal.message
    }
    currentList.push(message);
    chat.next(currentList);
});

database.ref(".info/connected").on("value", function(snap) {
    online.next(snap.val());
});

messages.on('child_changed', function(data) {
    console.info('child_changed', data, data.val());
});

messages.on('child_removed', function(data) {
    console.info('child_removed', data, data.val());
});

/*const auth =*/ firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        activeUser.next(user.email);
        console.info('user zalogowany', user);
    } else {
        activeUser.next(null);
        console.info('user wylogowany');
    }
});

//console.info('auth', auth);

const user = {
    //email: 'szeligagrzegorz@gmail.com',
    email: 'aaa@aaa.pl',
    password: 'aaaaaa'
};

const TestCreate = () => {
    console.info('Odpalam logowanie');

    firebase.auth().createUserWithEmailAndPassword(user.email, user.password).catch((error) => {
        console.info('error tworzenia użytkownika', error);    
    });
};

const TestLogin = () => {
    console.info('Odpalam logowanie');

    firebase.auth().signInWithEmailAndPassword(user.email, user.password).catch((error) => {
        console.info('error tworzenia użytkownika', error);    
    });
};

const TestLogout = () => {
    console.info('Odpalam wylogowanie');
    
    firebase.auth().signOut().catch((error) => {
        console.info('error wylogowania użytkownika', error);    
    });    
};

const AA = () => {
    firebase.auth().signInWithPopup(
        new firebase.auth.EmailAuthProvider()
        //new firebase.auth.GoogleAuthProvider()
    );
};

/*
robi zrzut całości (raz)
database.ref().once('value').then(snap => {
    console.info('zrzut', snap.val());
});
*/

type PropsType = {|
    className: string,
|};

export default class Chat extends BaseComponent<PropsType> {

    click = new Subject();

    _onChangeNick = (event: Object) => {
        nick.next(event.target.value);
    }

    _onChangeTextarea = (event: Object) => {
        textarea.next(event.target.value);
    }

    _onSend = () => {
        this.click.next();
    }

    constructor(props: PropsType) {
        super(props);

        this.subscribe$(
            this.click.asObservable().withLatestFrom2(
                nick.asObservable(),
                textarea.asObservable()
            )
            .do(([click, nickValue, textareaValue]) => {
                if (nickValue.length < 1) {
                    alert('Wpisz nick');
                    return;
                }

                if (textareaValue.length < 1) {
                    alert('Wpisz wiadomość');
                    return;
                }

                sending.next(true);
                textarea.next('');

                messages.push({
                    nick: nickValue,
                    message: textareaValue
                }).then((aaa) => {
                    console.info(`Wysłano wiadomość ${textareaValue}`);
                    sending.next(false);
                }).catch((error: Object) => {
                    console.error(error);
                    sending.next(false);
                });
            })
        );
    }

    render() {
        const nickValue = this.getValue$(nick.asObservable());
        const textareaValue = this.getValue$(textarea.asObservable());
        const sendingValue = this.getValue$(sending.asObservable());

        return (
            <div className="Chat__wrapper">
                { this._renderNetworkStatus() }

                { this._renderUser() }
                <br/>

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
                        { /*
                        <button onClick={TestCreate}>Utwórz</button>
                        <button onClick={TestLogin}>Loguj</button>
                        <button onClick={TestLogout}>Wyloguj</button>
                        <button onClick={AA}>AAA</button>
                        */ }
                    </div>
                </div>
                { this._renderList() }
                { sendingValue ? <div className="Chat__sending">Wysyłanie ...</div> : null }
            </div>
        );
    }

    _renderUser = () => {
        const activeUserValue = this.getValue$(activeUser.asObservable());
        if (activeUserValue) {
            return (
                <div>{activeUserValue}</div>
            );
        }

        return <div>No user</div>;
    }

    _renderNetworkStatus = () => {
        const onlineValue = this.getValue$(online.asObservable());
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
        const list = this.getValue$(chat.asObservable()).concat().reverse();
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


/*
this.cat = this.db.object('/cats/-KpRuC...Id')
this.dog = this.db.object('/dogs/-KpRuD...Id')
this.dogs = this.db.list('/dogs')

https://gist.github.com/deltaepsilon/b9ac6bdb5d30b1e4203ae3b2f6e2cd07#file-rxjs-firebase-demo-js
*/


/*
        const userId = "3121";
        const name = "name111";
        const email = "sdaasda";
        const imageUrl = "http://wwaw.psdasda";

        firebase.database().ref('users/' + userId).set({
            username: name,
            email: email,
            profile_picture : imageUrl
        });
*/