import * as express from 'express';
import * as bodyParser from 'body-parser';

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

app.listen(3000, () => console.log('Server is running'));

module.exports = app