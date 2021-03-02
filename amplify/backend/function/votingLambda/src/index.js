"use strict";
exports.__esModule = true;
var awsServerlessExpress = require("aws-serverless-express");
var app = require('./app');
var server = awsServerlessExpress.createServer(app);
exports.handler = function (event, context) {
    console.log("EVENT: " + JSON.stringify(event));
    return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};
