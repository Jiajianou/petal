
const blockchain = require('./blockchain');


const coin = new blockchain();

coin.createNewBlock(123, 'Abdsjkl9993','OIdskdsj335');

coin.createNewTransaction(100,'joe99999999','smith888888888');

coin.createNewBlock(22232, 'Abdsjkl9993sds','OIdskdsj335sds');

//pending transactions until the block is mined.
coin.createNewTransaction(400,'joe99999999','smith888888888');
coin.createNewTransaction(200,'joe99999999','smith888888888');
coin.createNewTransaction(300,'joe99999999','smith888888888');


coin.createNewBlock(89867, 'Abdsjkl9993sdsd','OIdskdsj335sdssa');

console.log(coin);
