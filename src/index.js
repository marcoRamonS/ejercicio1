import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

firebase.initializeApp({
  apiKey: "AIzaSyCa-cBdAX2E3Nr9P1DYf9OcrOBH6kEAYNg",
    authDomain: "eje1-f5f75.firebaseapp.com",
    databaseURL: "https://eje1-f5f75.firebaseio.com",
    projectId: "eje1-f5f75",
    storageBucket: "eje1-f5f75.appspot.com",
    messagingSenderId: "804939192043"

});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
