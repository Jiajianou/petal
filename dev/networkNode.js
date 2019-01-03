const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const port = process.argv[2];
const rp = require('request-promise');

const nodeAddress = uuid().split("-").join("");

const petal = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/blockchain', function(req, res){
  res.send(petal);

});






app.post('/transaction', function(req,res){
  // const blockIndex = petal.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
  //
  // res.json({note:`Transaction will be added in blcok ${blockIndex}`});

  const newTransaction = req.body;
  const blockIndex = petal.addTransactionToPendingTransactions(newTransaction);

  res.json({note: `Transaction will be added in block ${blockIndex}.`});
});







app.post('/transaction/broadcast',function(req,res){
  const newTransaction = petal.createNewTransaction(req.body.amount,req.body.sender,req.body.recipient);
  petal.addTransactionToPendingTransactions(newTransaction);

  const requestPromises = [];

  petal.networkNodes.forEach(networkNodeUrl =>{
    //broadcast to other network nodes by sending requests.
    const requestOptions = {
      uri: networkNodeUrl + '/transaction',
      method: 'POST',
      body: newTransaction,
      json: true
    };
    requestPromises.push(rp(requestOptions));
  });

  //running the request promises
  Promise.all(requestPromises).then(data =>{
    res.json({note: 'Transaction created and broadcasted successfully.'});
  });
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



  const requestPromises = [];

  petal.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/receive-new-block',
      method: 'POST',
      body: {newBlock: newBlock},
      json: true
    };

    requestPromises.push(rp(requestOptions)); //fill the array with promises.
  });

  Promise.all(requestPromises).then(data => {
    //broadcast the mining reward transaction.
    const requestOptions = {
      uri: petal.currentNodeUrl + '/transaction/broadcast',
      method: 'POST',
      body: {
        amount: 12.5,
        sender: "00",
        recipient: nodeAddress
      },
      json: true
    };

    return rp(requestOptions);


  }).then(data => {

    res.json({
      note: "New block mined successfully",
      block: newBlock
    });

  });

  //petal.createNewTransaction(12.5, "00", nodeAddress);

  // res.json({
  //   note: "New block mined successfully",
  //   block: newBlock
  // });

});





app.post('/receive-new-block', function(req, res){
  const newBlock = req.body.newBlock;
  const lastBlock = petal.getLastBlock();

  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

  if(correctHash && correctIndex) {
    petal.chain.push(newBlock);
    petal.pendingTransactions = [];
    res.json({
      note: 'New block received and accepted.',
      newBlock: newBlock
    });
  } else {
    res.json({
      note: 'New block rejected.',
      newBlock: newBlock
    })
  }
});









app.post('/register-and-broadcast-node', function(req, res){

  const newNodeUrl = req.body.newNodeUrl;
  //if the node url is not already in the list, the add it onto the list.
  if(petal.networkNodes.indexOf(newNodeUrl) == -1) petal.networkNodes.push(newNodeUrl);

  const regNodesPromises = [];

  //then broadcast it.
  petal.networkNodes.forEach(networkNodeUrl =>{

    //define a request option object

    const requestOptions = {
      uri: networkNodeUrl + '/register-node',
      method: 'POST',
      body: {newNodeUrl:newNodeUrl},
      json:true

    };

    regNodesPromises.push(rp(requestOptions));

  });

  //registering this new node with all the nodes in the network.
  Promise.all(regNodesPromises).then(data =>{
    const bulkRegisterOptions = {
      uri: newNodeUrl + '/register-nodes-bulk',
      method: 'POST',
      body: {allNetworkNodes: [...petal.networkNodes, petal.currentNodeUrl]},
      json:true
    };

    return rp(bulkRegisterOptions);

  }).then(data => {
    res.json({note: "new node registered successfully"});
  });


});







app.post('/register-node', function(req,res){
  //register a node with the network.
  const newNodeUrl = req.body.newNodeUrl;
  const nodeNotAlreadyPresent = petal.networkNodes.indexOf(newNodeUrl) == -1;
  const notCurrentNode = petal.currentNodeUrl !== newNodeUrl;

  if(nodeNotAlreadyPresent && notCurrentNode) petal.networkNodes.push(newNodeUrl);

  res.json({note:"New node registered successfully."});

});







app.post('/register-nodes-bulk', function(req,res){
  //register all nodes to the new node.
  const allNetworkNodes = req.body.allNetworkNodes;

  allNetworkNodes.forEach(networkNodeUrl => {
    const nodeNotAlreadyPresent = petal.networkNodes.indexOf(networkNodeUrl) == -1;
    const notCurrentNode = petal.currentNodeUrl !== networkNodeUrl;
    if(nodeNotAlreadyPresent && notCurrentNode) petal.networkNodes.push(networkNodeUrl);
  });

  res.json({note: "Bulk registration successfully"});


});


app.get('/consensus', function(req, res){

  const requestPromises = [];

  petal.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/blockchain',
      method: 'GET',
      json: true
    };

    requestPromises.push(rp(requestOptions));

  });

  Promise.all(requestPromises).then(blockchains => {
    //blockchains from all the network nodes.

    const currentChainLength = petal.chain.length;
    let maxChainLength = currentChainLength;
    let newLongestChain = null;
    let newPendingTransactions = null;

    blockchains.forEach(blockchain => {
      //determine wether or not there is a blockchain that is longer than all the other nodes.

      if(blockchain.chain.length > maxChainLength){

        maxChainLength = blockchain.chain.length;
        newLongestChain = blockchain.chain;
        newPendingTransactions = blockchain.pendingTransactions;
      };

    });

    if(!newLongestChain || (newLongestChain && !petal.chainIsValid(newLongestChain))){
      res.json({
        note: 'Current chain has not been replaced.',
        chain: petal.chain
      })
    } else if (newLongestChain && petal.chainIsValid(newLongestChain)){
      petal.chain = newLongestChain;
      petal.pendingTransactions = newPendingTransactions;
      res.json({
        note:'This chain has been replaced',
        chain: petal.chain
      });
    };
  });
});







app.listen(port, function(){
  console.log(`The server is listening on port ${port}`);
});
