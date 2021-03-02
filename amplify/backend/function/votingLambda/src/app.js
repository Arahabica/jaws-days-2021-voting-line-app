"use strict";
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
var AWS = require("aws-sdk");
//var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var dynamodb = new AWS.DynamoDB.DocumentClient();
var tableName = "User";
if (process.env.ENV && process.env.ENV !== "NONE") {
    tableName = tableName + '-' + process.env.ENV;
}
var app = express();
app.use(bodyParser.json());
// Enable CORS for all methods
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});
app.get("/liffid", function (req, res) {
    console.log("tomomi");
    res.json({ liffId: process.env.LIFF_ID });
});
app.get("/hello", function (req, res) {
    res.json({ item: "Hello！" });
});
app.post("/hello", function (req, res) {
    console.log(req.body);
    res.json({ item: "Hello！" });
});
app.get("/event", function (req, res) {
    var tableName = "Event";
    if (process.env.ENV && process.env.ENV !== "NONE") {
        tableName = tableName + '-' + process.env.ENV;
    }
    console.log("tableName: " + tableName);
    var queryParams = {
        TableName: tableName,
        Key: { "event_id": req.body["event_id"] }
    };
    dynamodb.get(queryParams, function (err, data) {
        if (err) {
            res.statusCode = 500;
            res.json({ error: 'Could not load items: ' + err });
        }
        else {
            res.json(data.Item.event_name);
        }
    });
});
app.get("/speakerlist", function (req, res) {
    var tableName = "SpeakerList";
    if (process.env.ENV && process.env.ENV !== "NONE") {
        tableName = tableName + '-' + process.env.ENV;
    }
    console.log("tableName: " + tableName);
    var queryParams = {
        TableName: tableName
    };
    dynamodb.scan(queryParams, function (err, data) {
        if (err) {
            res.statusCode = 500;
            res.json({ error: 'Could not load items: ' + err });
        }
        else {
            res.json(data.Items);
        }
    });
});
app.listen(3000, function () { return console.log('Server is running'); });
module.exports = app;
