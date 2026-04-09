# 📝 Feedback Board DApp

A **Decentralized Application (DApp)** that lets users submit public feedback to the Ethereum blockchain. Built as a beginner-friendly project to demonstrate smart contract interaction through a modern, glassmorphism-styled web interface.

---

## 🛠️ Tech Stack

| Layer        | Technology                     |
| ------------ | ------------------------------ |
| Smart Contract | Solidity `^0.8.24`           |
| Frontend     | HTML5 · CSS3 · Vanilla JS     |
| Web3 Library | Ethers.js v6 (CDN ESM import) |
| Wallet       | MetaMask                       |
| Network      | Sepolia Testnet                |

---

## ⚙️ Features

- 🦊 **MetaMask Wallet Connection** — connect/disconnect with visual status indicator
- 📝 **Submit Feedback** — write messages that are permanently stored on-chain
- 📋 **View All Feedback** — fetches and displays every feedback entry from the contract
- 🔔 **Real-time Event Listening** — instantly notified when someone else submits feedback via Solidity events
- ⏳ **Loading State & Spinner** — button disables and shows a mining spinner during transaction confirmation
- 🍞 **Toast Notifications** — non-intrusive slide-in toasts replace traditional `alert()` popups
- 🎨 **Unique Avatars** — each wallet address gets a deterministic color-coded avatar
- 🕐 **Formatted Timestamps** — raw `block.timestamp` values are converted to human-readable dates
- 🌑 **Dark Glassmorphism UI** — sleek dark theme with backdrop blur, gradients, and micro-animations

---

## 📁 Project Structure

```
Feedback_board_dapp_using_solidity/
├── feedback.html              # Main frontend page
├── styles.css                 # Dark-theme glassmorphism styles
├── app.js                     # Ethers.js integration & UI logic
├── feedback_board_dapp.sol    # Solidity smart contract
└── README.md                  # Project documentation (this file)
```

---

## 📜 Smart Contract — `FeedbackBoard`

**Deployed on Sepolia:** [`0xb11DdFc4b09C388894B9baCB1a22F9301299B1b2`](https://sepolia.etherscan.io/address/0xb11DdFc4b09C388894B9baCB1a22F9301299B1b2)

### Data Structure

```solidity
struct Feedback {
    address sender;      // Wallet address of the submitter
    string  message;     // The feedback message
    uint256 timestamp;   // Block timestamp when submitted
}
```

### Functions

| Function             | Type    | Description                                    |
| -------------------- | ------- | ---------------------------------------------- |
| `submitFeedback(_msg)` | Write   | Pushes a new feedback and emits an event       |
| `getFeedback(index)`   | Read    | Returns sender, message, and timestamp by index |
| `getTotalFeedback()`   | Read    | Returns the total number of feedbacks stored   |

### Events

```solidity
event FeedbackSubmitted(address indexed sender, string message, uint256 timestamp);
```

---

## 🚀 Getting Started

### Prerequisites

- [MetaMask](https://metamask.io/) browser extension installed
- MetaMask configured to the **Sepolia Testnet**
- Some Sepolia test ETH (get from a [faucet](https://sepoliafaucet.com/))

### Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/ArunJeevan29/Feedback_board_dapp_using_solidity.git
   cd Feedback_board_dapp_using_solidity
   ```

2. **Serve the frontend**  
   Use any static file server. For example, with VS Code's **Live Server** extension:
   - Open the project folder in VS Code
   - Right-click `feedback.html` → **Open with Live Server**

   Or use Python:
   ```bash
   python -m http.server 5500
   ```

3. **Open in browser**  
   Navigate to `http://localhost:5500/feedback.html`

4. **Connect MetaMask** and start submitting feedback!

---

## 🔄 How It Works

```
┌─────────────┐    Ethers.js     ┌────────────────────┐    Sepolia    ┌────────────────┐
│  Frontend    │ ──────────────► │  MetaMask Wallet   │ ───────────► │  FeedbackBoard │
│  (HTML/JS)   │ ◄────────────── │  (Tx Signing)      │ ◄─────────── │  (Solidity)    │
└─────────────┘   Events/Reads   └────────────────────┘   On-chain   └────────────────┘
```

1. User clicks **Connect Wallet** → MetaMask prompt to approve connection
2. User types feedback and clicks **Submit** → MetaMask prompts to sign the transaction
3. Transaction is mined → `FeedbackSubmitted` event fires → UI auto-refreshes
4. All feedback is fetched via `getTotalFeedback()` + `getFeedback(i)` and rendered as cards

---

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
