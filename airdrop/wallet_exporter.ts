import bs58 from 'bs58'
const stdin = "//wallet address here//";
let wallet = bs58.decode(stdin);
console.log(wallet);
