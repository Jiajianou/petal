
const blockchain = require('./blockchain');


const coin = new blockchain();

const previousBlockHash = "bj2b3jk2hj3h2423k2jh34hvfjh23";
const currentBlockData = [
  {amount:10,
  sender: "nlsdfskld",
  recipient: "skldjflskjd"},
  {amount:20,
  sender: "nlsdfskld",
  recipient: "skldjflskjd"},
  {amount:30,
  sender: "nlsdfskld",
  recipient: "skldjflskjd"}
];

console.log(coin.proofOfWork(previousBlockHash,currentBlockData));

// const nonce = 100;
//
// console.log(coin.hashBlock(previousBlockHash, currentBlockData,nonce));

// coin.createNewBlock(123, 'Abdsjkl9993','OIdskdsj335');
//
// coin.createNewTransaction(100,'joe99999999','smith888888888');
//
// coin.createNewBlock(22232, 'Abdsjkl9993sds','OIdskdsj335sds');
//
// //pending transactions until the block is mined.
// coin.createNewTransaction(400,'joe99999999','smith888888888');
// coin.createNewTransaction(200,'joe99999999','smith888888888');
// coin.createNewTransaction(300,'joe99999999','smith888888888');
//
//
// coin.createNewBlock(89867, 'Abdsjkl9993sdsd','OIdskdsj335sdssa');

//console.log(coin);
