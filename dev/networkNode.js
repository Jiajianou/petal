const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const port = process.argv[2];

const nodeAddress = uuid().split("-").join("");

const petal = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/blockchain', function(req, res){
  res.send(petal);

});

app.post('/transaction', function(req,res){
  const blockIndex = petal.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);

  res.json({note:`Transaction will be added in blcok ${blockIndex}`});



});

app.get('/mine', function(req, res){

  const lastBlock = petal.getLastBlock();
  const previousBlockHash = lastBlock['hash'];
  const currentBlockData = {
    transaction: petal.pendingTransactions,
    index: lastBlock['index'] + 1
  };

  const nonce = petal.proofOfWork(previousBlockHash, currentBlockData);

  const blockHash = petal.hashBlock(previousBlockHash, currentBlockData, nonce);

  const newBlock = petal.createNewBlock(nonce, previousBlockHash, blockHash);

  petal.createNewTransaction(12.5, "00", nodeAddress);

  res.json({
    note: "New block mined successfully",
    block: newBlock
  });

});


app.post('/register-and-broadcast-node', function(req, res){
  const newNodeUrl = req.body.newNodeUrl;
});


app.post('/register-node', function(req,res){

});

app.post('/register-nodes-bulk', function(req,res){
  
});

app.listen(port, function(){
  console.log(`The server is listening on port ${port}`);
});
