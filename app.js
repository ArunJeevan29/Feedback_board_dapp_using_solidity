import{BrowserProvider,Contract} from "https://cdn.jsdelivr.net/npm/ethers@6.8.1/+esm";

const contractAddress = "0xb11DdFc4b09C388894B9baCB1a22F9301299B1b2";
const abi = [
	{
		"anonymous": false,
		"inputs": [
			{ "indexed": true, "internalType": "address", "name": "sender", "type": "address" },
			{ "indexed": false, "internalType": "string", "name": "message", "type": "string" },
            { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
		],
		"name": "FeedbackSubmitted",
		"type": "event"
	},
	{
		"inputs": [{ "internalType": "uint256", "name": "", "type": "uint256"}],
		"name": "feedbacks",
		"outputs": [
			{ "internalType": "address", "name": "sender", "type": "address" },
			{ "internalType": "string", "name": "message", "type": "string" },
            { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }],
		"name": "getFeedback",
		"outputs": [
			{ "internalType": "address", "name": "", "type": "address" },
			{ "internalType": "string", "name": "", "type": "string" },
            { "internalType": "uint256", "name": "", "type": "uint256" }
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalFeedback",
		"outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{ "internalType": "string", "name": "_msg", "type": "string" }],
		"name": "submitFeedback",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

let contract;
let provider;
let signer;

const walletaddress = document.getElementById("walletaddress");
const walletStatus = document.getElementById("wallet-status");

// Added Feature: Toast Notification instead of constant alerts
function showToast(message) {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span>✅</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = "fadeOut 0.3s forwards";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Added Feature: Format the raw block.timestamp
function formatTimestamp(timestamp) {
    if (!timestamp || timestamp == 0) return "Just now";
    return new Date(Number(timestamp) * 1000).toLocaleString();
}


window.onload = () => {
    // We add a tiny safety check so the app doesn't crash if someone doesn't have metamask
    if (typeof window.ethereum !== 'undefined') {
        const readProvider = new BrowserProvider(window.ethereum);
        const readContract = new Contract(contractAddress, abi, readProvider); 
        
        readContract.getTotalFeedback()
        .then(() => displayFeedbacks(readContract))
        .catch(() => console.log("Wallet not connected, skipping display"));
    }
};


document.getElementById("connect").onclick = async () => {

    provider = new BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

    const currentAddress = await signer.getAddress();

    // UI Updates
    walletaddress.textContent = currentAddress.substring(0, 6) + "..." + currentAddress.substring(38);
    walletStatus.textContent = "Status: Connected";
    document.getElementById("connect").innerHTML = "<span>✅ Connected</span>";
    document.getElementById("connect").style.background = "linear-gradient(135deg, #10b981, #059669)";

    contract = new Contract(contractAddress, abi, signer);

    showToast("Wallet Connected"); // Using toast instead of alert

    contract.on("FeedbackSubmitted", async (sender, message, timestamp) => {
        const currentAddress = await signer.getAddress();
        if (sender.toLowerCase() !== currentAddress.toLowerCase()) {
            showToast(`New feedback from ${sender.substring(0,6)}...`);
        }
        displayFeedbacks(contract);
    });

    displayFeedbacks(contract);
}


document.getElementById("submitBtn").onclick = async () => {
    if (!contract) return alert("Please connect your wallet first.");
    const msg = document.getElementById("feedbackInput").value;
    if(!msg) return alert("Please enter a message");

    // UI Loading Feature
    const submitBtn = document.getElementById("submitBtn");
    const loader = document.getElementById("submitLoader");
    const btnText = submitBtn.querySelector(".btn-text");

    try {
        submitBtn.disabled = true;
        btnText.textContent = "Mining...";
        loader.style.display = "inline-block";

        const tx = await contract.submitFeedback(msg);
        await tx.wait();

        document.getElementById("feedbackInput").value = "";
        showToast("Feedback Submitted");
    } catch(error) {
        console.log(error);
        alert("Transaction Failed");
    } finally {
        submitBtn.disabled = false;
        btnText.textContent = "🚀 Submit Feedback";
        loader.style.display = "none";
    }
}

// We pass the contractInstance to allow the window.onload to use a read-only one
async function displayFeedbacks(contractInstance = contract) {

    const container = document.getElementById("allFeedbacks");
    container.innerHTML = "";

    try {
        const total = await contractInstance.getTotalFeedback();
        
        for (let i = 0; i < total; i++) {
            const [sender, message, timestamp] = await contractInstance.getFeedback(i);
            
            const div = document.createElement("div");
            div.className = "feedbackItem";
            
            // Randomly generate color Hue based on the user's address! 
            const hue = parseInt(sender.substring(2,6), 16) % 360;

            // Same innerHTML template you wrote, just mapped to the new CSS classes!
            div.innerHTML = `
                <div class="feedback-header">
                    <div class="sender-info">
                        <div class="avatar" style="background: hsl(${hue}, 70%, 60%)">
                           ${sender.substring(2,4).toUpperCase()}
                        </div>
                        <span class="sender-address">${sender.substring(0, 6)}...${sender.substring(38)}</span>
                    </div>
                    <span class="timestamp">${formatTimestamp(timestamp)}</span>
                </div>
                <p class="feedback-message">${message}</p>
            `;

            container.prepend(div); // prepend places newest at the top
        }
    } catch(error) {
        console.error("Error Fetching feedbacks:", error);
        container.innerHTML = `<p style='color: #ef4444; padding: 15px; text-align: center;'>Error loading feedbacks. Check console for details.</p>`;
    }
}
