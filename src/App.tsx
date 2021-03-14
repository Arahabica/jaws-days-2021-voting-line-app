import React, { useEffect, useState, Component } from 'react';
import API from '@aws-amplify/api';
import Amplify, {Hub} from "aws-amplify";
import liff from '@line/liff';
import { NumberParam, useQueryParam, StringParam } from 'use-query-params'
import './App.css';
import awsmobile from "./aws-exports";

// Amplifyの設定を行う
Amplify.configure(awsmobile)

function App() {
  const [userName, setUserName] = useState<string>("");
  const [eventName, setEventName] = useState<string>("");
  const [icon, setIcon] = useState<string>("");
  const [spekaerList, setSpekaerList] = useState([]);
  const [eventId, setEventId] = useQueryParam('event_id', StringParam);
  
  var items:any = []
  const getRandomPassword = () => {
    const randomValues = new Uint8Array(30);
    window.crypto.getRandomValues(randomValues);
    return Array.from(randomValues)
        .map(v => v.toString(16).padStart(2, '0'))
        .join('');
  }
  
  useEffect(() => {
    console.log(eventId)
    const fn = async () => {
      let cognitoUser:any = null
      Hub.listen("auth", async (data) => {
        switch (data.payload.event) {
          case "signIn": {
            cognitoUser = await Amplify.Auth.currentAuthenticatedUser();
            console.log(`signed in ... ${cognitoUser.username}`);
            console.log(cognitoUser);
            var option = {
              response: true,
              body: {
                event_id: "1"
              }
            };
            console.log(option);
            await new Promise(resolve => setTimeout(resolve, 2000));
            await API.post("votingApiGateway", "/vote", option);
            break;
          }
          default:
            break;
        }
      });
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
        .then(async () => {
          if (!liff.isLoggedIn()) {
              liff.login();
          } else {
            const profile = await liff.getProfile()
            setUserName(profile.displayName);
            setIcon(profile.pictureUrl+"")
            console.log(profile.pictureUrl)
            idToken = liff.getIDToken()
            accessToken = liff.getAccessToken()
            console.log("★idToken : " + idToken)
            console.log("★accessToken : " + accessToken)

            if (!cognitoUser) {
              try {
                cognitoUser = await Amplify.Auth.signIn({
                  username: profile.userId
                });
              } catch (e) {
                await Amplify.Auth.signUp({
                  username: profile.userId, // Required, the username
                  password: getRandomPassword(),
                  attributes: {
                    email: `${getRandomPassword()}@sample.com`,
                  },
                });
                cognitoUser = await Amplify.Auth.signIn({
                  username: profile.userId
                });
              }
              cognitoUser = await Amplify.Auth.sendCustomChallengeAnswer(cognitoUser, idToken);
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