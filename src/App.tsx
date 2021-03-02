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
  const [item, setItem] = useState<string>("");
  const [icon, setIcon] = useState<string>("");
  
  useEffect(() => {
    
    const fn = async () => {
      // オプション
      const myInit = {
          headers: {},
          response: true
      };
      var idToken = null
      var accessToken = null
      // get LiffId
      await API.get("votingApiGateway", "/liffid", myInit)
      .then(response => {
        liff.init({
          liffId: response.data.liffId
        })
        .then(() => {
          if (!liff.isLoggedIn()) {
              liff.login();
          } else {
            liff.getProfile().then(function(profile) {
              setUserName(profile.displayName);
              //setIcon(profile.pictureUrl)
            }).catch(function(error) {
                window.alert('Error getting profile: ' + error);
            });
            idToken = liff.getIDToken()
            accessToken = liff.getAccessToken()
            console.log("★idToken : " + idToken)
            console.log("★accessToken : " + accessToken)
          }
        })
        .catch((err) => {
          alert(err);
        });
        
      })
      .catch(error => {
          console.log(error)
          alert(error)
      });
      
      // 
      await API.get("votingApiGateway", "/hello", myInit)
      .then(response => {
        setItem(response.data.item)
      })
      .catch(error => {
          console.log(error)
          alert(error)
      });
      
      // オプション
      const option = {
          headers: {},
          response: true,
          body: {
            idToken : idToken,
            accessToken : accessToken
          }
      };
      
      await API.post("votingApiGateway", "/hello", option)
      .then(response => {
        console.log("post ok")
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
        <img src={icon} alt="icon" />
        <p>{item} {userName}</p>
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