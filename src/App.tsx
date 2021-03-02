import React, { useEffect, useState } from 'react';
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
  const [value, setVale] = useState<string>("");
  const [spekaerList, setSpekaerList] = useState([]);
  var items:any = []
  
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