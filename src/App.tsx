import React, { useEffect } from 'react';
import API from '@aws-amplify/api';
import Amplify from "aws-amplify";
import logo from './logo.svg';
import './App.css';
import awsmobile from "./aws-exports";

// Amplifyの設定を行う
Amplify.configure(awsmobile)

function App() {
  
  useEffect(() => {
    console.log("start");
    // オプション
    const myInit = {
        headers: {},
        response: true
    };
    
    // get LiffId
    API.get("votingApiGateway", "/items", myInit).then(response => {
        console.log(response.data.liffId);
        alert(response.data.liffId)
    }).catch(error => {
        console.log(error)
        alert(error)
    });
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
