import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as AWS from 'aws-sdk';
//var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

const dynamodb = new AWS.DynamoDB.DocumentClient();
const cognitoidentity = new AWS.CognitoIdentity();
const identityPoolId = 'ap-northeast-1:0cec5433-566f-4756-b8c0-b9ee98c0eabe';

const app = express();
app.use(bodyParser.json())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

app.get("/liffid", function(req, res) {
  res.json({liffId : process.env.LIFF_ID});
});
app.get("/hello", function(req, res) {
  res.json({item : "Hello！"});
});

app.post("/hello", function (req, res) {
  console.log(req.body)
  res.json({ item: "Hello！" });
});

app.post("/event", function(req, res) {
    let tableName = "Event";
    if(process.env.ENV && process.env.ENV !== "NONE") {
      tableName = tableName + '-' + process.env.ENV;
    }

  console.log("tableName: " + tableName)
  
  let queryParams = {
    TableName:  tableName,
    Key: {"event_id" : req.body["event_id"]}
  }

  dynamodb.get(queryParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({error: 'Could not load items: ' + err});
    } else {
      res.json(data.Item.event_name);
    }
  });
});

app.post("/speakerlist", function(req, res) {
    let tableName = "SpeakerList";
    if(process.env.ENV && process.env.ENV !== "NONE") {
      tableName = tableName + '-' + process.env.ENV;
    }

  console.log("tableName: " + tableName)
  var params = {
    TableName: tableName,
    KeyConditionExpression   : "event_id = :event_id",
    ExpressionAttributeValues: {
        ":event_id": req.body["event_id"],
    }
    
  };
  
  dynamodb.query(params, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({error: 'Could not load items: ' + err});
    } else {
      res.json(data.Items);
    }
  });
});


app.get("/speakerlist", function(req, res) {
    let tableName = "SpeakerList";
    if(process.env.ENV && process.env.ENV !== "NONE") {
      tableName = tableName + '-' + process.env.ENV;
    }

  console.log("tableName: " + tableName)
  
  let queryParams = {
    TableName:  tableName
  }

  dynamodb.scan(queryParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({error: 'Could not load items: ' + err});
    } else {
      var items = []
      data.Items.forEach(function(item, index){
           console.log(item.speaker_id);
           items.push({value: item.speaker_id, label: item.speaker_name})
       });
      res.json(data.Items);
    }
  });
});
app.post("/login", function (req, res) {
  console.log(req.body);
  //res.json({ hello: 'hello'});
  var params = {
    IdentityPoolId: identityPoolId,
    Logins: {
        'login.cognitetest.rsasage': req.body.userId
    }
  };
  cognitoidentity.getOpenIdTokenForDeveloperIdentity(params,function(err,data){
    if(err){
      throw err;
    } else {
      console.log(data);
      res.json(data);
    }
  });
});

app.listen(3000, () => console.log('Server is running'));

module.exports = app
