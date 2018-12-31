const sha256 = require('sha256');



//This is the constructor function for the data structure.
//In javascript, a class is a suger coated version of a constructor function.
function Blockchain(){
  this.chain =[];
  this.pendingTransactions = []; //pending transactions untial the block is mined

  this.createNewBlock(100, 'thisIsTheGenesisBlock', '0'); //genesis block.


}

//this is similar to java method.
Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash){

  //this is what everyblock in the blockchain looks like.

  const newBlock = {
    //block properties
    index: this.chain.length + 1,
    timesamp: Date.now(),
    transactions: this.pendingTransactions,
    nonce:nonce, //comes from proof of work, a number that prooves that a block is legitimate.
    hash: hash, //the trasction is compressed into a signle string. this is the hash of current block.
    previousBlockHash: previousBlockHash

  };

  this.pendingTransactions = [];
  this.chain.push(newBlock);

  return newBlock;

}

Blockchain.prototype.getLastBlock = function(){
  return this.chain[this.chain.length - 1];
}

Blockchain.prototype.createNewTransaction = function(amount, sender, recipient){

  //new transaction object
  const newTransaction = {
    amount: amount,
    sender: sender,
    recipient: recipient
  };

  //adds to the pending transactions array
  this.pendingTransactions.push(newTransaction);

  return this.getLastBlock()['index'] + 1;

}

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce){

  //takes in a block, returns a hashed string with sha256.
  //sha256 will take any string/text and encrypts it into a hashed string.
  //If the input string is the same, then the output will always be the same.

  const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);

  const hash = sha256(dataAsString);

  return hash;

};

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData){

  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash,currentBlockData,nonce);

  while(hash.substring(0,4) !== '0000'){
    nonce++;
    hash = this.hashBlock(previousBlockHash,currentBlockData,nonce);
  }

  return nonce;
};


module.exports = Blockchain;
