import React, { useEffect, useState, Component } from 'react';
import API from '@aws-amplify/api';
import Amplify from "aws-amplify";
import liff from '@line/liff';
import { NumberParam, useQueryParam, StringParam } from 'use-query-params'
import './App.css';
import AuthService from "./AuthService";
import awsmobile from "./aws-exports";

// Amplifyの設定を行う
Amplify.configure(awsmobile)

const auth = new AuthService()

function App() {
  const [userName, setUserName] = useState<string>("");
  const [eventName, setEventName] = useState<string>("");
  const [icon, setIcon] = useState<string>("");
  const [spekaerList, setSpekaerList] = useState([]);
  const [eventId, setEventId] = useQueryParam('event_id', StringParam);
  
  var items:any = []
  
  useEffect(() => {
    console.log(eventId)
    const fn = async () => {
      // オプション
      const myInit = {
          headers: {},
          response: true
      };
      let idToken: string = ''
      let accessToken: string = ''
      // get LiffId
      await API.get("votingApiGateway", "/liffid", myInit)
      .then(response => {
        liff.init({
          liffId: response.data.liffId
        })
        .then(async () => {
          if (!liff.isLoggedIn()) {
              liff.login();
          } else {
            const profile = await liff.getProfile()
            setUserName(profile.displayName);
            setIcon(profile.pictureUrl+"")
            console.log(profile.pictureUrl)
            idToken = liff.getIDToken() || ''
            accessToken = liff.getAccessToken() || ''
            console.log("★idToken : " + idToken)
            console.log("★accessToken : " + accessToken)
            console.log(profile.userId, accessToken);
            if (!auth.isAuthenticated()) {
              await auth.signIn(profile.userId, accessToken);
            }
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
            event_id : eventId
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
      
      await API.post("votingApiGateway", "/speakerlist", option)
      .then(response => {
        response.data.forEach(function(item:any){
             console.log(item.speaker_id);
             items.push({value: item.speaker_id, label: item.speaker_name})
         });
        setSpekaerList(items)
        
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
        <img src={icon} className="App-icon" alt="icon" /><p>{userName}さん</p>
        <p>投票システム</p>
        <p>{eventName}</p>
        <select>
{spekaerList.map(
      (n:any)=>(
        <option key={n.value} value={n.value}>
          {n.label}
        </option>
      ))}
      </select>
      </header>
    </div>
  );
}

export default App;