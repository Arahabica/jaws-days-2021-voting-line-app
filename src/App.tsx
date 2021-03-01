import React, { useEffect, useState } from 'react';
import API from '@aws-amplify/api';
import Amplify from "aws-amplify";
import logo from './logo.svg';
import liff from '@line/liff';
import './App.css';
import awsmobile from "./aws-exports";

// Amplifyの設定を行う
Amplify.configure(awsmobile)

function App() {
  const [userName, setUserName] = useState<string>("");
  
  useEffect(() => {
    console.log("start");
    // オプション
    const myInit = {
        headers: {},
        response: true
    };
    
    const fn = async () => {
      // get LiffId
      await API.get("votingApiGateway", "/items", myInit)
      .then(response => {
        liff.init({liffId: response.data.liffId})
        if (!liff.isLoggedIn()) {
          liff.login()
        }
        // プロフィール取得
        liff.getProfile()
        .then(profile => {
          setUserName(profile.displayName)
        })
        .catch((err) => {
          console.log('error', err)
        })
      })
      .catch(error => {
          console.log(error)
          alert(error)
      });
      
    }
    fn()
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{userName}</p>
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
