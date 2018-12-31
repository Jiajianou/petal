var express = require('express');
var app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/blockchain', function(req, res){
  res.send("hello");

});

app.post('/transaction', function(req,res){
  console.log(req.body);
  res.send(`the amount is ${req.body.amount}`);


});

app.get('/mine', function(req, res){

});

app.listen(3000, function(){
  console.log("The server is listening on port 3000");
});
