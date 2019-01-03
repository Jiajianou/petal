
const blockchain = require('./blockchain');


const coin = new blockchain();

const bc1 = {
"chain": [
{
"index": 1,
"timesamp": 1546525817083,
"transactions": [],
"nonce": 100,
"hash": "0000",
"previousBlockHash": "0000"
},
{
"index": 2,
"timesamp": 1546525873655,
"transactions": [
{
"amount": 1,
"sender": "88sdf9sd89fsdfsdfsdfs9fds",
"recipient": "sdfsd0f9dsfsd87fy6s6dfs6",
"transactionId": "3374f5400f6411e9957c0d40536cfd9f"
}
],
"nonce": 69401,
"hash": "0000d70a8c3504359b56c54c2fc6f76392ea1b58cb957189c949e786d72512cb",
"previousBlockHash": "0000"
},
{
"index": 3,
"timesamp": 1546525887796,
"transactions": [
{
"amount": 12.5,
"sender": "00",
"recipient": "17230cb00f6411e9957c0d40536cfd9f",
"transactionId": "38ddff900f6411e9957c0d40536cfd9f"
},
{
"amount": 2,
"sender": "88sdf9sd89fsdfsdfsdfs9fds",
"recipient": "sdfsd0f9dsfsd87fy6s6dfs6",
"transactionId": "3e5980700f6411e9957c0d40536cfd9f"
}
],
"nonce": 85109,
"hash": "000062ffd1d9ea1eb8fda46261bbdf36a9c2716bc4ee0d1b043ce1a404cfba80",
"previousBlockHash": "0000d70a8c3504359b56c54c2fc6f76392ea1b58cb957189c949e786d72512cb"
},
{
"index": 4,
"timesamp": 1546525899807,
"transactions": [
{
"amount": 12.5,
"sender": "00",
"recipient": "17230cb00f6411e9957c0d40536cfd9f",
"transactionId": "414974700f6411e9957c0d40536cfd9f"
},
{
"amount": 3,
"sender": "88sdf9sd89fsdfsdfsdfs9fds",
"recipient": "sdfsd0f9dsfsd87fy6s6dfs6",
"transactionId": "4538d7100f6411e9957c0d40536cfd9f"
}
],
"nonce": 96618,
"hash": "00001e4b961b0a2c1ebfafe0675bc3b4f674a5e98bdb96308b6df993675dad13",
"previousBlockHash": "000062ffd1d9ea1eb8fda46261bbdf36a9c2716bc4ee0d1b043ce1a404cfba80"
}
],
"pendingTransactions": [
{
"amount": 12.5,
"sender": "00",
"recipient": "17230cb00f6411e9957c0d40536cfd9f",
"transactionId": "4872cc600f6411e9957c0d40536cfd9f"
}
],
"currentNodeUrl": "http://localhost:3001",
"networkNodes": []
};


console.log(coin.chainIsValid(bc1.chain));
