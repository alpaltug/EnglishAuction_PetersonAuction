var userAddress;
var provider;
var signer;


async function connectWallet () {
    console.log('Connect Wallet clicked');

    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    provider = new ethers.providers.Web3Provider(window.ethereum);
    
    // MetaMask requires requesting permission to connect users accounts
    await provider.send("eth_requestAccounts", []);
    console.log(provider);

    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    signer = provider.getSigner();

    let userAddress = await signer.getAddress();
    let net = await provider.getNetwork();
    let netName = net.name;
    console.log(netName);
    let balance = await provider.getBalance(userAddress);

    document.getElementById("wallet").innerText = 
        `${userAddress}   Network: ${netName}   Bal: ${(+ethers.utils.formatEther(balance)).toFixed(4)}`;

    setUpContract();

}

// original - wo event
//const contractAddress = "0x571702de91449f3c9dc76003ec40d44b3162089e";
// 2nd one - w event
//const contractAddress = "0xD14F8223d4254ea781c611AFEDe1aaFB30d2Bcf6";
// greeterf
//const contractAddress = "0x646Ff94436760740E185060772CEBf99dB2A54b0";
// 20220713
const contractAddress = "0x1B8D95ea0Eb6A5b4DbA4f16a756D41ac27F089C9";

var contract;

var data;

var auctionNumber;



async function setUpContract () {


    //import abi from "../abis/contract.json";
    //const contractabi = JSON.parse('../abis/contract.json'); // the ABI

    console.log("Auction number is: ", auctionNumber);


    
    
    const contractABI = [
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "string",
            "name": "d",
            "type": "string"
          }
        ],
        "name": "auctionEvent",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "_bidAmount",
            "type": "uint256"
          }
        ],
        "name": "bidEvent",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "desc",
            "type": "string"
          }
        ],
        "name": "CreateEnglishNewAuction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "desc",
            "type": "string"
          }
        ],
        "name": "CreateNewPedersonAuction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "auctions",
        "outputs": [
          {
            "internalType": "contract EnglishAuction",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getAddresses",
        "outputs": [
          {
            "internalType": "address[]",
            "name": "",
            "type": "address[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "num",
            "type": "uint256"
          }
        ],
        "name": "getAuction",
        "outputs": [
          {
            "internalType": "contract EnglishAuction",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getAuctions",
        "outputs": [
          {
            "internalType": "contract EnglishAuction[]",
            "name": "",
            "type": "address[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getDescs",
        "outputs": [
          {
            "internalType": "string[]",
            "name": "",
            "type": "string[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getPedersnDescs",
        "outputs": [
          {
            "internalType": "string[]",
            "name": "",
            "type": "string[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getPedersonAddresses",
        "outputs": [
          {
            "internalType": "address[]",
            "name": "",
            "type": "address[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "num",
            "type": "uint256"
          }
        ],
        "name": "getPedersonAuction",
        "outputs": [
          {
            "internalType": "contract Auction",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getPedersonAuctions",
        "outputs": [
          {
            "internalType": "contract Auction[]",
            "name": "",
            "type": "address[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "pederson_auctions",
        "outputs": [
          {
            "internalType": "contract Auction",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];
    console.log(contractABI);

    //const contract = new ethers.Contract(contractAddress, contractABI, provider.getSigner()); 
    console.log('Create contract obj');
    contract = new ethers.Contract(contractAddress, contractABI, signer);   
    console.log(contract);
    console.log('contract ready for interaction');

    contract.on("bidEvent", (event, _bidAmount) => {
      console.log('Event placeBid received: the bid is ' , _bidAmount);
      console.log('Event bidEvent received: event obj is ', event);
      loadTable();
  });
  contract.on("auctionEvent", (event, desc) => {
    console.log('Event createAuction: the desc is ' , desc);
    console.log('Event auctionEvent received: event obj is ', event);
    loadTable1();
});


    document.getElementById("cAddress").innerText = contractAddress;
}


async function placeBid () {

    let b = document.getElementById('bid').value
    console.log(`Bidding with an amount ${b} ...`);
    const tx = await contract.placeBid(b);
    const txReceipt = await tx.wait();
    if (txReceipt.status !== 1) {
        alert('Setting new bid failed');
    } else {
        console.log(`Successfully bidded with amount ${b}`)
        console.log(txReceipt);
        console.log(BigInt(txReceipt.gasUsed));
        console.log(txReceipt.effectiveGasPrice);
        console.log(BigInt(txReceipt.cumulativeGasUsed));

        //const gasUsed = receipt.getTransactionReceipt().gasUsed;
        //console.log('Gas fee used: \t', ethers.utils.formatEther(txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice)))
    }
}

async function loadTable () {
  let bids = [];
  const addresses = await contract.getAddresses();
  const bidAmounts = await contract.getBids();


  for (let i = 0; i < addresses.length; i++) {
    newBid = {
      "addr": addresses[i],
      "bid": bidAmounts[i]
    }
    bids.push(newBid);
  }

  const tableBody = document.getElementById('tableData');
  let dataHTML = '';

  for(let bidder of bids) {
    dataHTML += `<tr><td>${bidder.addr}</td><td>${bidder.bid}</td></tr>`;
  }
  console.log(dataHTML);

  tableBody.innerHTML = dataHTML;
}

async function loadTable1 () {
    let contracts = [];
    const auctions = await contract.getAuctions();
    const descriptions = await contract.getDescs();
    const addresses = await contract.getAddresses();
    const pederson_auctions = await contract.getPedersonAuctions();
    const pederson_descriptions = await contract.getPedersnDescs();
    const pederson_addresses = await contract.getPedersonAddresses();
  
  
    for (let i = 0; i < auctions.length; i++) {
      newContract = {
        "addr": auctions[i],
        "desc": descriptions[i],
        "owner": addresses[i]
      }
      contracts.push(newContract);
    }
    for (let i = 0; i < pederson_auctions.length; i++) {
      newContract = {
        "addr": pederson_auctions[i],
        "desc": pederson_descriptions[i],
        "owner": pederson_addresses[i]
      }
      contracts.push(newContract);
    }
  
    const tableBody = document.getElementById('tableData');
    let dataHTML = '';
  
    for(let cont of contracts) {
      dataHTML += `<tr><td>${cont.addr}</td><td>${cont.desc}</td></tr>`;
    }
    console.log(dataHTML);
  
    tableBody.innerHTML = dataHTML;
  }



async function setIdx () {
  const cb = document.querySelector('#checkbox');
  const checked = cb.checked;
  val = document.getElementById('auc').value;

  if (checked) {
    console.log(`Fetching the pederson auction address to: ${val} ...`);
    const auc = await contract.getPedersonAuction(0);
    location.replace(`http://127.0.0.1:5500/index1.html?value=${auc}`)
  }
  else {
    console.log(`Fetching the auction address to: ${val} ...`);
    const auc = await contract.getAuction(val);
    location.replace(`http://127.0.0.1:5500/index.html?value=${auc}`)
  }

}
  async function CreateNewContract () {
    const cb = document.querySelector('#checkbox');
    const checked = cb.checked;

    if (!checked) {
      val =  document.getElementById('name').value;
      console.log(`Creating a new contract with the description: ${val} ...`);
      const tx = await contract.CreateEnglishNewAuction(val);
    }
    else {
      val =  document.getElementById('name').value;
      console.log(`Creating a new pederson contract with the description: ${val} ...`);
      const tx = await contract.CreateNewPedersonAuction(val);
    }

    

        //const gasUsed = receipt.getTransactionReceipt().gasUsed;
        //console.log('Gas fee used: \t', ethers.utils.formatEther(txReceipt.gasUsed.mul(txReceipt.effectiveGasPrice)))
  }



async function getHighestBid () {


  console.log('Fetching the highest bid info...');
  const highestBid = await contract.getHighestBid();
  const highestBindingBid = await contract.getHighestBindingBid();

  console.log("The highest bid is:", highestBid);
  console.log("The highest binding bid is:", highestBindingBid);

  document.getElementById("hb").innerText = highestBid;
  document.getElementById("hbb").innerText = highestBindingBid;


}






