import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

import "./main-style.css";
import Routes from "./Routes";

import * as firebase from "firebase";

//https://api.covid19api.com/dayone/country/brazil

firebase.initializeApp({
  apiKey: "AIzaSyDmQrh7lyPtYLNY-QFd-o_nMYmdLRZOadM",
  authDomain: "covid19system-5923d.firebaseapp.com",
  projectId: "covid19system-5923d",
  storageBucket: "covid19system-5923d.appspot.com",
  messagingSenderId: "1024519625314",
  appId: "1:1024519625314:web:0948f73d3c3b7721c84f3b",
  measurementId: "G-RDRW4HHN86"
});
firebase.analytics();

window.document.title = "COVID-19";

console.clear();

ReactDOM.render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
