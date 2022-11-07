// install moralis first - npm install moralis-v1
const Moralis = require("moralis-v1");

// import moralis(import for React)
const serverUrl = "";
const appId = "";
Moralis.start({ serverUrl, appId });

// IMPORTING ETHERS.JS
const ethers = Moralis.web3Library;

// importing the ABIs and bytecode
import { _bytecode } from "./bytecode.js";
import { _abi } from "./abi.js";
import { _usdtABI } from "./usdtABI.js";

// the user address
var userAddress; // to be displayed on the frontend after wallet has been connected
var signer; // ethers.js object

// import the model bytecode and ABI for the contract
const bytecode = _bytecode; // the model index token bytecode
const abi = _abi; // the model index token ABI
const usdtABI = _usdtABI; // the model ERC20 token ABI

// connect metamask wallet
async function connectWallet() {
    web3provider = await Moralis.enableWeb3({ provider: "walletconnect"});
    await web3provider.send("eth_requestAccounts", []);
    signer = web3provider.getSigner();
    userAddress = await signer.getAddress();
    // function on the backend
    // login(returns transaction history, balance, tokens owned and created by address)
    // display address and user details
}

// creating a new index
async function createIndex() {
        // These will be the inputs for the function
        // inputs will be 3 arrays for addresses, Names and ratios but they could be just inputs then put into an array
        // these are just examples
        // the user would be able to select these variable from the frontend
    // const addresses = [
    //     "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
    //     "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    //     "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
    // ]

    // const Names = [
    //     "Bitcoin",
    //     "Ether",
    //     "Matic"
    // ]
    // const ratio = [
    //     3,
    //     2,
    //     1
    // ]
    // const buyAmount - amount of usdt the user wants to use in creating the index token
    // name of index token
    // symbol of token(three character string)

    const _amount = buyAmount * (10 ** 6);
    const _total = ratio[0] + ratio[1] + ratio[2];
    const total = BigInt(_total);
    const amount = BigInt(_amount);
    const unit = amount / total;
    const ratio1 = BigInt(ratio[0]);
    const ratio2 = BigInt(ratio[1]);
    const ratio3 = BigInt(ratio[2]);

    const tokenAmount1 = unit * ratio1;
    const tokenAmount2 = unit * ratio2;
    const tokenAmount3 = unit * ratio3;

    const tokenAmount = [
        tokenAmount1,
        tokenAmount2,
        tokenAmount3
    ]

    
    let Address = await signer.getAddress();
    factory = new ContractFactory(abi, bytecode, signer);
    contract = await factory.deploy();
    let contractAddress = contract.address;
    await contract.deployTransaction.wait();
    const indexContract = new ethers.Contract(contractAddress, abi, signer);
    // approving the contract to spend the user's usdt
    const usdtContract = new ethers.Contract("0xc2132D05D31c914a87C6611C10748AEb04B58e8F", usdtABI, signer);
    await usdtContract.approve(contractAddress, amount);
    await indexContract.createFund(addresses, Names, ratio, tokenAmount);
    // function on the backend
    // create token(takes in the name, contract address and creator of the token and updates the history of the user and creates a new instance of the token just created)
}

// function to handle investing in an index token
async function buyIndex() {
    // inputs
    // contractAddress - the index Token contract address 
    // const buyAmount - amount of usdt the user wants to use in purchasing the fund token

    const _amount = buyAmount * (10 ** 6);
    const amount = BigInt(_amount);
    let Address = await signer.getAddress();
    
    const indexContract = new ethers.Contract(contractAddress, abi, signer);
    // approving the contract to spend the user's usdt
    const usdtContract = new ethers.Contract("0xc2132D05D31c914a87C6611C10748AEb04B58e8F", usdtABI, signer);
    await usdtContract.approve(contractAddress, amount);
    await indexContract.investFund(amount);
    // function on the backend
    // buytoken(takes in the userAddress and the contract address updates the users record for tokens owned and transactions)
}

// function to handle selling off
async function sellIndex() {
    // inputs
    // contractAddress
    // contractAddress - the index Token contract address 
    // const sellAmount - amount of tokens the user wants to sell

    const _amount = sellAmount * (10 ** 18);
    const amount = BigInt(_amount);
    let Address = await signer.getAddress();
    
    const indexContract = new ethers.Contract(contractAddress, abi, signer);

    await indexContract.Redeem(amount);
    // function on the backend
    // selltoken(takes in the userAddress and the contract address then updates the users record for tokens owned and transactions)
}


async function getAllFunds() {
    // call backend API function to retrieve all funds
}