// DECLARE NEW INSTANCE OF BLOCKCHAIN
var web3vlx = new Web3(new Web3.providers.HttpProvider("https://evmexplorer.velas.com/rpc"));

// SMART CONTRACT DECLARE
const SMART_CONTRACT_ADDRESS = '0x23cBE614a3a5d41fc38dAc32A33403cb02CA6d39';
const ABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_imgCID",
				"type": "string"
			}
		],
		"name": "addData",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_newOwner",
				"type": "address"
			}
		],
		"name": "changeOwner",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "deleteData",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "getAllImage",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "imgArray",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// DECLARE NEW INSTANCE OF CONRACT
var contract = new web3vlx.eth.Contract(ABI, SMART_CONTRACT_ADDRESS);

// HTML DIV DECLARE
var outputDiv = document.getElementById('output');

// FILE INPUT DECALRE
const fileInput = document.getElementById('fileInput');

var fileName = '';
var fileType = '';
var fileSize = '';

var cidTemp = '';

var user = '';

// METAMASK FUNCTION
async function mm(){
    if(typeof window.ethereum !== "undefined"){
        console.log("METAMASK INSTALLED")
        try {
         user =  await ethereum.request({method: "eth_requestAccounts"})
         user = user.toString();

		 if (window.ethereum) {
			web3user = new Web3(window.ethereum);
			window.ethereum.enable();
		  }


        } catch (error) {
            if (error.code === 4001) {
				// User has rejected the login request
				console.log("User rejected login request");
				// Display a message to the user
				document.getElementById('container-xxl').innerHTML = "Please approve the login request to access this application. Reload the page to try again ";
			  } else {
				// Handle other errors
				console.error(error);
			  }
        }
        

    }
    else{
        document.getElementById('container-xxl').innerHTML = "Install Metamask to access this application"
    }

}

window.addEventListener("load", function () {
    if (window.ethereum) {
      // detect Network account change
      window.ethereum.on("networkChanged", function (networkId) {
        // console.log("networkChanged", networkId);
        checkChain();
      });
    }
  });

// CHECKS USER CHAIN IS VELAS OR NOT
async function checkChain(){
    if (window.ethereum.networkVersion != 106) {
        document.getElementById('container-xxl').innerHTML = 'Chain Changed! Please select VELAS Chain and Login Again!';

       } else {
       }
}

// WHENEBER FILE SELECTED
fileInput.addEventListener('change', (event) => {
	let fileinfo = document.getElementById('file-info');
	let myButton = document.getElementById("uploadButton"); 

	try {
		const selectedFile = event.target.files[0];

		fileName = replaceSpacesWithUnderscores(selectedFile.name);
		fileType = selectedFile.type;
		fileSize = bytesToMB(selectedFile.size);

		fileinfo.innerHTML = `
		File Name: ${fileName}<br><br>
		File Type: ${fileType}<br>
		File Size: ${fileSize} MB<br><br>
		<button id="uploadButton" style="width: 100%; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;" class="button" onclick="storeImage()" >Upload</button> 

		`;

		
		myButton.removeAttribute("disabled");

	} catch (error) {
		
	}
  });

// HELPER FUCNTIONS
function bytesToMB(bytes) {
	return (bytes / (1024 * 1024)).toFixed(2);
  }

function replaceSpacesWithUnderscores(str) {
return str.replace(/\s+/g, '_');
}

function shortenString(str, maxLength) {
	if (str.length <= maxLength) {
	  return str;
	}
	
	let midpoint = Math.ceil(str.length / 2);
	let firstHalf = str.slice(0, midpoint - 1);
	let secondHalf = str.slice(-midpoint + 1);
	
	return `${firstHalf}...${secondHalf}`;
  }

// WHEN FILE SELECT CLICK
  fileInput.addEventListener('click', (event) => {
	let fileinfo = document.getElementById('file-info');
	fileinfo.innerHTML = `
		File Name: - <br><br>
		File Type: - <br>
		File Size: - <br><br>
		<button id="uploadButton" style="width: 100%; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;" class="button" onclick="storeImage()" disabled>Upload</button> 
		`;

		document.getElementById('logDiv').innerHTML = '';
		
  });


async function getData() {

    let data = await contract.methods.getAllImage().call()
	console.log(data)

    for(i in data){

        let outputContent = `

		<table class="output-table">
			<tr>
				<td width="10%"><img src="https://cf-ipfs.com/ipfs/${data[i]}" width="80px" height="80px"></td>
				<td> <p class="card-text"><a href="https://cf-ipfs.com/ipfs/${data[i]}" target="_blank">${data[i]}</a></p></td>
			</tr>
		</table>

        
        `;

        outputDiv.innerHTML += outputContent;

    }

    

}

async function storeImage(){
document.getElementById('logDiv').innerHTML = `<br><br>
<label for="file">Uploading progress:</label>
<progress id="file" value="33" max="100">  </progress> <br><br> <p id="log">Uploading to IPFS ...</p>`


const endpoint = 'https://api.nft.storage/upload';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDU0NTU4MjQxNGM5ZTMyZjI4ODAzODNkYzczMzUxMUNCQTYyNEQ5QTgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4MDY1NjU3NTI5MCwibmFtZSI6InRyaWFsIn0.QLPns4wStjHRptNIssMjB2iXXrzmJtAom2OVZvzpehw';

if (fileInput.files.length === 0) {
  console.log('No file selected.');
  return;
}

const file = fileInput.files[0];
const contentType = file.type;

console.log(contentType)

fetch(endpoint, {
	method: 'POST',
	headers: {
	  'accept': 'application/json',
	  'Content-Type': contentType,
	  'Authorization': `Bearer ${token}`
	},
	body: file
  })
	.then(response => response.json())
	.then(data => {
		
		if(data.ok = true){
			cidTemp = data.value.cid
			console.log(cidTemp)
			document.getElementById('file').setAttribute("value", "66")
			document.getElementById('log').innerHTML += `<br> Uploaded File to IPFS Successfully<br><br>Uploading CID on Blockchain<br>Please approve transaction on Metamask`
			var contractUser = new web3user.eth.Contract(ABI, SMART_CONTRACT_ADDRESS);

			contractUser.methods.addData(cidTemp)
			.send({from: user, gas: 3000000})
			.then((receipt) => {
				console.log(receipt);

				if(receipt.status = true){
				document.getElementById('file').setAttribute("value", "100")
				document.getElementById('log').innerHTML += `<br> Uploaded CID on Blockchain Successfully <br><br> You can upload more files or go to main menu` 

				setInterval(function() {
					document.getElementById('log').innerHTML = '';
				  }, 2000);
				  
				}else{

				}
			})
			.catch((error) => {
				console.error(error);
				if (error.code === 4001) {
					// Display a message to the user
					document.getElementById('logDiv').innerHTML += "<br>ERROR: User Rejected Request";
				  } else {
					// Handle other errors
					console.error(error);
				  }
			});

		}else if(data.ok = false){

		}

		console.log(data)
	})
	.catch(error => console.error(error));
}

async function deleteByCIDFromStorage(cid){

}

// OPEN/CLOSE FUNCTIONS
function openSettings(){
	document.getElementById('menu').style.display = "none";
	document.getElementById('settings').style.display = "block";

}

function openAddFiles(){
	document.getElementById('menu').style.display = "none";
	document.getElementById('addFile').style.display = "block";

}

function openFiles(){
	getData();
	document.getElementById('menu').style.display = "none";
	document.getElementById('output').style.display = "block";

}

function openMenu(){

	try {
		document.getElementById('settings').style.display = "none";
		document.getElementById('output').style.display = "none";
		document.getElementById('addFile').style.display = "none";

	} catch (error) {
		
	}

	document.getElementById('menu').style.display = "block";
	

}



mm();