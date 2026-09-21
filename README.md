<div align="center">

<img src=".github/assets/banner.svg" width="100%" alt="VeritasChain — Authenticate Reality. Preserve Truth."/>

<br/>

<img src="VeritasChain.png" width="180" alt="VeritasChain Logo"/>

<br/>
<br/>

**A decentralized media integrity platform built on Ethereum + IPFS.**

Stamp any file with a cryptographic fingerprint anchored forever on-chain.<br/>
Verify it. Prove it. Share the proof with anyone — no account, no trust required.

<br/>

![Ethereum](https://img.shields.io/badge/Ethereum-Solidity%20%C2%B7%20Truffle-C9A84C?style=for-the-badge&logo=ethereum&logoColor=F6E9BC&labelColor=0B0B0D)
![IPFS](https://img.shields.io/badge/IPFS-Kubo-C9A84C?style=for-the-badge&logo=ipfs&logoColor=F6E9BC&labelColor=0B0B0D)
![React](https://img.shields.io/badge/React%2019-Three.js%20%C2%B7%20MUI%20v7-C9A84C?style=for-the-badge&logo=react&logoColor=F6E9BC&labelColor=0B0B0D)
![FastAPI](https://img.shields.io/badge/FastAPI-Python%203.10+-C9A84C?style=for-the-badge&logo=fastapi&logoColor=F6E9BC&labelColor=0B0B0D)
![Docker](https://img.shields.io/badge/Docker-Compose-C9A84C?style=for-the-badge&logo=docker&logoColor=F6E9BC&labelColor=0B0B0D)
![License](https://img.shields.io/badge/License-MIT-C9A84C?style=for-the-badge&labelColor=0B0B0D)

<br/>

### ▸ Live Demo

![Demo Part 1](gifs/Demo-First-Half.gif)

![Demo Part 2](gifs/Demo-Second-Half.gif)

</div>

---

## ◆ What Is This?

In a world where reality is manufactured, the only currency worth having is **verifiable truth**.

VeritasChain lets you prove a file — a photo, a document, a video, a dataset — existed at a specific
moment in time, uploaded by a specific wallet, **without trusting any centralized authority**.

> The proof lives on the Ethereum blockchain. It cannot be altered, deleted, or disputed.

<div align="center">

<img src=".github/assets/flow.svg" width="100%" alt="Pipeline: file → SHA-256 → IPFS → Ethereum → proof"/>

</div>

---

## ◆ The Pipeline

| # | Stage | What happens |
|:-:|-------|--------------|
| **1** | **Hash** | File is fingerprinted with SHA-256. The raw file never becomes a public artifact. |
| **2** | **Pin** | Content is pinned to IPFS (Kubo) and you receive a content-addressed **CID**. |
| **3** | **Anchor** | `UserFileStorage.uploadFile(fileHash, fileName)` writes hash + wallet + `block.timestamp` on-chain. |
| **4** | **Prove** | You get a certificate: IPFS CID + transaction ID. Anyone can verify it, forever. |

Verification is a pure read: `verifyFile(fileHash)` returns a boolean straight from contract storage — no
server, no database, nothing to compromise.

---

## ◆ Features

<table>
<tr>
<td width="50%" valign="top">

### ⬢ Stamp
Upload any file. Its SHA-256 fingerprint is anchored on-chain via smart contract, tied to your wallet.

</td>
<td width="50%" valign="top">

### ⬢ Verify
Paste an IPFS hash. Instantly know whether it has a blockchain record — **no account required**.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### ⬢ Chain of Custody
Every record carries wallet address, timestamp, and transaction ID — an immutable audit trail.

</td>
<td width="50%" valign="top">

### ⬢ Developer API
Generate an API key with your MetaMask wallet. Stamp files from any pipeline or CI job.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### ⬢ No Accounts
No sign-ups. No email. No passwords. Your wallet **is** your identity.

</td>
<td width="50%" valign="top">

### ⬢ No File Custody
We keep no file database. Only cryptographic fingerprints and CIDs live on-chain.

</td>
</tr>
</table>

---

## ◆ Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│  FRONTEND  ·  React 19 · Three.js (@react-three/fiber + drei)        │
│              MUI v7 · Framer Motion · React Router 7                 │
│    Landing · Upload · Verify · How It Works · Docs · API Keys        │
└───────────────────────────────┬──────────────────────────────────────┘
                                │  REST  /api/v1
┌───────────────────────────────▼──────────────────────────────────────┐
│  BACKEND  ·  FastAPI (Python 3.10+) · web3.py                        │
│    /files/*      public  — upload · verify · transactions · hashes   │
│    /files/developer/*    — API-key guarded (X-API-Key header)        │
│    /api-keys/*           — generate · get · regenerate · delete      │
└──────────────┬──────────────────────────────────┬────────────────────┘
               │                                  │
┌──────────────▼──────────────┐   ┌───────────────▼────────────────────┐
│  IPFS  ·  Kubo node         │   │  ETHEREUM  ·  Ganache / testnet    │
│  :5001 API · :8080 gateway  │   │  UserFileStorage.sol (OpenZeppelin)│
└─────────────────────────────┘   └────────────────────────────────────┘
```

**Smart contract — `contracts/contracts/UserFileStorage.sol`**

| Function | Purpose |
|----------|---------|
| `uploadFile(fileHash, fileName)` | Anchor a fingerprint against `msg.sender` |
| `verifyFile(fileHash)` | Pure read — does this hash have a record? |
| `getAllFileHashes()` | Every hash, name and timestamp for the caller |
| `getFileMetadata(...)` / `updateFileMetadata(...)` | Read / amend record metadata |
| `getFileHashByTransaction(txId)` | Resolve a transaction back to its fingerprint |
| `getTransactionDetails(txHash)` | Full on-chain record for a transaction |
| `searchFiles(query)` | Substring search across stored file names |
| `deleteFile(fileHash)` | Retire a record owned by the caller |

---

## ◆ API Reference

Base URL: `http://localhost:8000/api/v1` · Interactive docs: `http://localhost:8000/docs`

### Public

| Method | Endpoint | Params |
|--------|----------|--------|
| `POST` | `/files/upload` | multipart: `file`, `file_name`, `user_address` |
| `GET` | `/files/verify` | `file_hash` |
| `GET` | `/files/transactions` | `user_address` |
| `GET` | `/files/all-hashes` | `user_address` |
| `GET` | `/files/ipfs-data` | `file_hash` |
| `GET` | `/files/hash-by-transaction` | `transaction_id` |

### API keys

| Method | Endpoint |
|--------|----------|
| `POST` | `/api-keys/generate?user_address=0x…` |
| `GET` | `/api-keys/get/{user_address}` |
| `POST` | `/api-keys/regenerate?user_address=0x…` |
| `DELETE` | `/api-keys/delete/{user_address}` |

### Developer — requires `X-API-Key` header

| Method | Endpoint | Params |
|--------|----------|--------|
| `POST` | `/files/developer/upload` | multipart: `file`, `file_name`, `user_address` |
| `GET` | `/files/developer/transactions` | `user_address` |
| `GET` | `/files/developer/files-with-urls` | `user_address` |
| `GET` | `/files/developer/transaction-details` | `tx_hash` |
| `GET` | `/files/developer/blockchain-stats` | — (block height, gas price) |
| `GET` | `/files/developer/balance` | `user_address` |
| `GET` | `/files/developer/search` | `query` |
| `GET` | `/files/developer/recent-transactions` | `limit` (default 10) |
| `PUT` | `/files/developer/update-metadata` | `file_hash` + JSON body |
| `DELETE` | `/files/developer/delete` | `file_hash` |

<details>
<summary><b>Stamp a file from the command line</b></summary>

```bash
# 1 — mint an API key for your wallet
curl -X POST "http://localhost:8000/api/v1/api-keys/generate?user_address=0xYourWallet"

# 2 — stamp a file
curl -X POST "http://localhost:8000/api/v1/files/developer/upload?user_address=0xYourWallet" \
  -H "X-API-Key: <your-key>" \
  -F "file=@evidence.png" \
  -F "file_name=evidence.png" \
  -F "user_address=0xYourWallet"

# 3 — verify it (public, no key needed)
curl "http://localhost:8000/api/v1/files/verify?file_hash=<ipfs-cid>"
```

</details>

---

## ◆ Quick Start

### Docker — one command

```bash
./start_all.sh          # macOS / Linux
.\start_all.ps1         # Windows PowerShell
```

Brings up Ganache + IPFS, migrates the contract, then boots backend and frontend.

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger docs | http://localhost:8000/docs |
| IPFS WebUI | http://localhost:5001/webui |
| Ganache RPC | http://localhost:7545 |

### Manual setup

<details>
<summary><b>1 — Smart contracts</b></summary>

```bash
cd contracts
npm install
npx truffle migrate --network development
# Note the deployed contract address for the backend env
```

</details>

<details>
<summary><b>2 — Backend</b></summary>

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload   # http://localhost:8000
```

</details>

<details>
<summary><b>3 — Frontend</b></summary>

```bash
cd frontend
npm install
cp .env.example .env
npm start                       # http://localhost:3000
```

</details>

**Prerequisites:** Node.js 18+ · Python 3.10+ · MetaMask · Docker (or Ganache locally)

Full walkthrough in [SETUP.md](SETUP.md).

---

## ◆ Environment

**`backend/.env`**
```env
WEB3_PROVIDER_URI=http://127.0.0.1:7545
IPFS_API_URL=http://127.0.0.1:5001
IPFS_GATEWAY_URL=http://127.0.0.1:8080/ipfs
CONTRACT_ABI_PATH=../contracts/build/contracts/UserFileStorage.json
```

**`frontend/.env`**
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_IPFS_BASE_URL=https://ipfs.io/ipfs/
```

> ⚠️ `CORS_ORIGINS` defaults to `["*"]` in [backend/app/core/config.py](backend/app/core/config.py#L27) —
> restrict it to your real origins before any public deployment.

---

## ◆ Project Structure

```
VeritasChain/
├── frontend/                       # React 19 + Three.js
│   └── src/
│       ├── Components/             # LandingPage · BlockchainFileUploader · VerifyPage
│       │                           # HowItWorksPage · DocsPage · AboutPage · APIKeyPage
│       │                           # TransactionList
│       └── Micro-Components/       # Navbar · Footer · HeroSection · ParticleNetwork
│                                   # FeatureCard · StatsSection · Logo
├── backend/                        # FastAPI
│   └── app/
│       ├── main.py                 # app factory, CORS, /api/v1 router mount
│       ├── api/endpoints/          # file_router · api_key_router
│       ├── api/dependencies/       # auth — X-API-Key + wallet binding
│       ├── services/               # IPFS pinning · chain writes · key lifecycle
│       ├── core/config.py          # pydantic settings
│       └── utils/                  # blockchain_helper · logger
├── contracts/                      # Truffle + OpenZeppelin
│   └── contracts/UserFileStorage.sol
├── infrastructure-compose.yml      # Ganache + IPFS
└── application-compose.yml         # backend + frontend
```

---

## ◆ Philosophy

VeritasChain was built anonymously.

No names. No faces. No VC funding. No agenda. Just tools that work.

> *"In a world where reality is manufactured, the only currency worth having is verifiable truth."*

The belief is simple: **knowledge should be free, and the tools to verify it should be available to all.**

*Judge the code, not the coder.*

---

## ◆ License

MIT — do whatever you want with it.

<div align="center">
<br/>

**⬢ ⬢ ⬢**

<sub>Hash it. Anchor it. Prove it.</sub>

</div>
