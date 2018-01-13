//@flow
import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyDon__hg5Iv1zi5uvMv2V5HCSGmy6NzDGE",
    authDomain: "rxczat.firebaseapp.com",
    databaseURL: "https://rxczat.firebaseio.com",
    projectId: "rxczat",
    storageBucket: "",
    messagingSenderId: "324635810240"
};

firebase.initializeApp(config);

export const database = firebase.database();


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