# VeritasChain  Frontend

React 19 app for the VeritasChain decentralized media integrity platform.

## Stack

- **React 19** with functional components and hooks
- **MUI v7** (Material UI) for layout and UI components
- **Framer Motion** for page and element animations
- **React Router v6** for client-side routing
- **ethers.js** for MetaMask / wallet integration

## Pages

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `LandingPage` | Hero, features, how it works overview |
| `/upload` | `BlockchainFileUploader` | Stamp a file on-chain |
| `/verify` | `VerifyPage` | Verify an IPFS hash against the blockchain |
| `/transactions` | `TransactionList` | Browse all stamped files for a wallet |
| `/api-keys` | `APIKeyPage` | Generate and manage API keys |
| `/docs` | `DocsPage` | API reference documentation |
| `/about` | `AboutPage` | Project philosophy |
| `/how-it-works` | `HowItWorksPage` | Step-by-step explainer |

## Development

```bash
npm install
cp .env.example .env    # set REACT_APP_API_URL and REACT_APP_IPFS_BASE_URL
npm start               # http://localhost:3000
```

## Production Build

```bash
npm run build
# Output in /build  serve with any static host
```

## Environment Variables

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_IPFS_BASE_URL=https://ipfs.io/ipfs/
```
