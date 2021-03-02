import React, { useEffect, useState } from 'react';
import Select from 'react-select'
import API from '@aws-amplify/api';
import Amplify from "aws-amplify";
import liff from '@line/liff';
import './App.css';
import awsmobile from "./aws-exports";

// Amplifyの設定を行う
Amplify.configure(awsmobile)

function App() {
  const [userName, setUserName] = useState<string>("");
  const [eventName, setEventName] = useState<string>("");
  const [icon, setIcon] = useState<string>("");
  const [sel, setSel] = useState<string>("");
  
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
              setIcon(profile.pictureUrl+"")
              console.log(profile.pictureUrl)
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
      
      var option = {
          headers: {},
          response: true,
          body: {
            event_id : "1"
          }
      };
      // 
      await API.post("votingApiGateway", "/event", option)
      .then(response => {
        setEventName(response.data)
      })
      .catch(error => {
          console.log(error)
          alert(error)
      });
      await API.get("votingApiGateway", "/speakerlist", myInit)
      .then(response => {
        setSel(response.data)
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
        <img src={icon} className="App-icon" alt="icon" />
        <p>{eventName} {userName}</p>
        <Select options={sel} />
      </header>
    </div>
  );
}

export default App;