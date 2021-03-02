import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as AWS from 'aws-sdk';
//var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "User";
if(process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const app = express();
app.use(bodyParser.json())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

app.get("/liffid", function(req, res) {
    console.log("tomomi")
  res.json({liffId : process.env.LIFF_ID});
  
});
app.get("/hello", function(req, res) {
  res.json({item : "Hello！"});
});

app.post("/hello", function (req, res) {
  console.log(req.body)
  res.json({ item: "Hello！" });
});

app.get("/event", function(req, res) {
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
      res.json(data.Items);
    }
  });
});

app.listen(3000, () => console.log('Server is running'));

module.exports = app