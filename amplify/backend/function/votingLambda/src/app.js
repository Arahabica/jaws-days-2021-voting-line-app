"use strict";
exports.__esModule = true;
var express = require("express");
var app = express();
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
app.listen(3000, function () { return console.log('Server is running'); });
module.exports = app;
