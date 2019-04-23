import firebase from 'firebase/app'

require("firebase/auth")
require("firebase/firestore")
require("firebase/storage")
require("firebase/functions")

var config = {
    apiKey: "AIzaSyCbGNaxbBmgyD9882lCkGsFjAPOgbPpI6U",
    authDomain: "teatro-super-opera-4564d.firebaseapp.com",
    databaseURL: "https://teatro-super-opera-4564d.firebaseio.com",
    projectId: "teatro-super-opera-4564d",
    storageBucket: "teatro-super-opera-4564d.appspot.com",
    messagingSenderId: "84622551570"
};
firebase.initializeApp(config);

const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()
const functions = firebase.functions()

export { firebase, auth, db, storage, functions }