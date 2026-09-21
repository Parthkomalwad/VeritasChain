# VeritasChain  Setup Guide

Full setup instructions for running VeritasChain locally, with or without Docker.

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Docker + Docker Compose | Latest | Containerized setup (recommended) |
| Node.js + npm | 18+ | Contract deployment / frontend |
| Python | 3.10+ | Backend (non-Docker setup) |
| MetaMask | Latest | Browser wallet for stamping files |

---

## Option A  Docker (Recommended)

The fastest way to get everything running.

### 1. Clone the repo

```bash
git clone https://github.com/AnonymousCoderDev/VeritasChain.git
cd VeritasChain
```

### 2. Start all services

**Windows:**
```powershell
.\start_all.ps1
```

**macOS / Linux:**
```bash
chmod +x start_all.sh
./start_all.sh
```

The script will:
- Start infrastructure (Ganache local blockchain + IPFS node)
- Deploy smart contracts to Ganache
- Start the FastAPI backend and React frontend

### 3. Verify everything is up

```bash
docker compose ps
```

### Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| IPFS WebUI | http://localhost:5001/webui |
| Ganache RPC | http://localhost:7545 |

---

## Option B  Manual Setup (No Docker)

### 1. Start Ganache

Download [Ganache](https://trufflesuite.com/ganache/) and start a local workspace on port **7545**.

### 2. Deploy Smart Contracts

```bash
cd contracts
npm install
npx truffle migrate --network development
# Copy the deployed contract address  you'll need it for the backend
```

### 3. Backend

```bash
cd backend
python -m venv venv

# macOS / Linux
source venv/bin/activate

# Windows
venv\Scripts\activate

pip install -r requirements.txt
cp .env.example .env    # fill in values below
uvicorn app.main:app --reload
```

### 4. Frontend

```bash
cd frontend
npm install
cp .env.example .env    # fill in values below
npm start
```

---

## Environment Variables

### `backend/.env`

```env
CONTRACT_ADDRESS=0x...    # from truffle migrate output
RPC_URL=http://127.0.0.1:7545
IPFS_API_URL=/dns/localhost/tcp/5001/http
```

### `frontend/.env`

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_IPFS_BASE_URL=https://ipfs.io/ipfs/
```

---

## MetaMask Setup

1. Open MetaMask → **Add Network**
2. Set RPC URL to `http://localhost:7545`
3. Chain ID: `1337`
4. Import a Ganache account using one of the private keys shown in Ganache

---

## Troubleshooting

**Containers won't start**
```bash
docker compose logs <service-name>
# Check for port conflicts  ensure 3000, 8000, 5001, 7545 are free
```

**Smart contract deployment fails**
- Confirm Ganache is running and reachable at `http://localhost:7545`
- Try `npx truffle migrate --network development --reset`

**Files not pinning to IPFS**
```bash
docker compose logs ipfs
```

**MetaMask not connecting**
- Confirm you added the network with RPC `http://localhost:7545` and Chain ID `1337`
- Try resetting the account in MetaMask → Settings → Advanced → Reset Account

---

## Useful Docker Commands

```bash
# View running containers
docker compose ps

# Tail logs from a service
docker compose logs -f backend

# Restart a service
docker compose restart frontend

# Stop everything
docker compose -f infrastructure-compose.yml -f application-compose.yml down

# Stop and wipe all data volumes
docker compose -f infrastructure-compose.yml -f application-compose.yml down -v
```

---

## API Endpoints

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/upload` | Stamp a file  returns IPFS hash + tx ID |
| `GET` | `/verify-ipfs` | Verify an IPFS hash against the blockchain |
| `GET` | `/user-transactions` | Fetch all stamped files for a wallet |

### Developer (requires API key)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/developer/generate-api-key` | Generate a new API key |
| `POST` | `/developer/upload-file` | Stamp a file programmatically |
| `GET` | `/developer/get-recent-transactions` | Recent transactions for a wallet |
| `GET` | `/developer/search-files` | Search stamped files |

Generate an API key from the **API Keys** page in the app using your MetaMask wallet.
