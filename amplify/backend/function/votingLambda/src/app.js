"use strict";
/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
exports.__esModule = true;
var aws_sdk_1 = require("aws-sdk");
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
var body_parser_1 = require("body-parser");
var express_1 = require("express");
aws_sdk_1["default"].config.update({ region: process.env.TABLE_REGION });
var dynamodb = new aws_sdk_1["default"].DynamoDB.DocumentClient();
var tableName = "User";
if (process.env.ENV && process.env.ENV !== "NONE") {
    tableName = tableName + '-' + process.env.ENV;
}
var userIdPresent = false; // TODO: update in case is required to use that definition
var partitionKeyName = "user_id";
var partitionKeyType = "S";
var sortKeyName = "";
var sortKeyType = "";
var hasSortKey = sortKeyName !== "";
var path = "/liffid";
var UNAUTH = 'UNAUTH';
var hashKeyPath = '/:' + partitionKeyName;
var sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';
// declare a new express app
var app = express_1["default"]();
app.use(body_parser_1["default"].json());
app.use(awsServerlessExpressMiddleware.eventContext());
// Enable CORS for all methods
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});
// convert url string param to expected Type
var convertUrlType = function (param, type) {
    switch (type) {
        case "N":
            return Number.parseInt(param);
        default:
            return param;
    }
};
app.get("/liffid", function (req, res) {
    res.json({ liffId: process.env.LIFF_ID });
});
app.get("/hello", function (req, res) {
    res.json({ item: "Hello！" });
});
app.post("/hello", function (req, res) {
    console.log("★idToken : " + req.body['idToken']);
    console.log("★accessToken : " + req.body['accessToken']);
    res.json({ item: "Hello！" });
});
app.listen(3000, function () {
    console.log("App started");
});
// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
