# VeritasChain  Backend

FastAPI server for the VeritasChain decentralized media integrity platform.

## Directory Structure

```
app/
├── api/
│   ├── endpoints/          # Route handlers (files, api keys)
│   └── dependencies/       # Auth middleware (API key validation)
├── core/
│   └── config.py           # Environment config (CONTRACT_ADDRESS, RPC_URL, etc.)
├── schemas/                # Pydantic request/response models
├── services/               # Business logic (file stamping, API key management)
└── utils/
    ├── blockchain_helper.py # Web3 / contract interaction
    ├── ipfs_helper.py       # IPFS pin and retrieve
    ├── api_key_helper.py    # Key generation and validation
    └── logger.py            # Structured logging
```

## Architecture

```
Request → API Layer (endpoints) → Service Layer → Utility Layer → Blockchain / IPFS
```

1. **API Layer**  validates input, handles HTTP responses
2. **Service Layer**  orchestrates business logic
3. **Utility Layer**  talks to Ethereum (via Web3) and IPFS

## Running

```bash
# from /backend
uvicorn app.main:app --reload
# or
python main.py
```

## API Docs

Once running, interactive docs are available at:

- **Swagger UI** → http://localhost:8000/docs
- **ReDoc** → http://localhost:8000/redoc

## Environment Variables

```env
CONTRACT_ADDRESS=0x...   # Deployed UserFileStorage contract address
RPC_URL=http://127.0.0.1:7545
IPFS_API_URL=/dns/localhost/tcp/5001/http
```
