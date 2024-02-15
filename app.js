
var cid='';
function uploadFile() {
const fileInput = document.getElementById('fileInput');
const file = fileInput.files[0];

const formData = new FormData();
formData.append('file', file);

const apiKey = '717c579e3fb60f7e05c4'; // Replace with your Pinata API Key
const apiSecret = 'cdb7a99f9d3e60f7d194768544bb5ec8fa3eff3aa782dcb6eae1dae4144b2845'; // Replace with your Pinata API Secret

const requestOptions = {
    method: 'POST',
    headers: {
        'pinata_api_key': apiKey,
        'pinata_secret_api_key': apiSecret,
    },
    body: formData,
};

fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', requestOptions)
    .then(response => response.json())
    .then(data => {
        console.log('Upload successful:', data);
        cid = data.IpfsHash;
        const url = 'https://gateway.pinata.cloud/ipfs/' + cid; // Constructing the URL
        alert('File uploaded successfully!');
    })
    .catch(error => {
        console.error('Error uploading file:', error);
        alert( 'Error uploading file: ' + error.message);
    });
}
// Initialize Web3
let web3;

// Check if MetaMask is installed
if (typeof window.ethereum !== 'undefined') {
    // Initialize Web3 object with the current provider
    web3 = new Web3(window.ethereum);

    // Request account access if needed
    window.ethereum.enable().then(function(accounts) {
        // Accounts now exposed
        console.log(accounts);
    });
} else {
    // MetaMask is not detected
    console.error('MetaMask not detected');
}

// Contract ABI (ApplicationRegistry)
const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "appId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "cid",
          "type": "string"
        }
      ],
      "name": "ApplicationCreated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "applications",
      "outputs": [
        {
          "internalType": "string",
          "name": "appId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "cid",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "applicationsByAppId",
      "outputs": [
        {
          "internalType": "string",
          "name": "appId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "cid",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "applicationsByCid",
      "outputs": [
        {
          "internalType": "string",
          "name": "appId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "cid",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "nextId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_appId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_cid",
          "type": "string"
        }
      ],
      "name": "createApplication",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_appId",
          "type": "string"
        }
      ],
      "name": "getApplicationByAppId",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_cid",
          "type": "string"
        }
      ],
      "name": "getApplicationByCid",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];

// Contract address
const contractAddress = '0x979f550AD35154F42b95da7cc4055Bf5E562A2F5';

// Initialize contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Function to create an application
async function createApplication() {
    console.log(cid);
    const accounts = await web3.eth.getAccounts();
    const appId = document.getElementById('appId').value;
    
    await contract.methods.createApplication(appId, cid).send({ from: accounts[0] });

    // Display success message
    alert("Application created successfully");
}

async function getApplication() {
  const appId = document.getElementById('appId').value;

  try {
      const accounts = await web3.eth.getAccounts();
      const app = await contract.methods.getApplicationByAppId(appId).call({ from: accounts[0] });
      if (app[0]) {
        const url = 'https://gateway.pinata.cloud/ipfs/' + app[1];
        console.log(url); // Constructing the URL
        document.getElementById('applicationDetails').innerHTML = `<p>Verification Successful</p><br><a href="${url}" target="_blank"><button id="submit-btn" style="margin-left: 50px;" type="button">View Document</button></a>`;
        
      } else {
          document.getElementById('applicationDetails').innerHTML = `<p>Verification failed</p>: Document not found`;
      }
  } catch (error) {
      console.error("Error retrieving application:", error);
      document.getElementById('applicationDetails').innerHTML =  `<p>Verification failed: Document not found</p>`;
  }
}



