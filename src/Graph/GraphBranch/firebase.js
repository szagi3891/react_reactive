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
