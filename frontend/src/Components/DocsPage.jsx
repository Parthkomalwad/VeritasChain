import { useState } from "react"
import { Box, Container, Typography, Chip, Collapse, Button } from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "../Micro-Components/Navbar"
import Footer from "../Micro-Components/Footer"
import CodeIcon from "@mui/icons-material/Code"
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined"
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import CheckIcon from "@mui/icons-material/Check"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined"

const apiEndpoints = {
    "File Management": [
        {
            name: "Upload File",
            method: "POST",
            endpoint: "/api/v1/files/developer/upload",
            description: "Upload a file to IPFS and store its reference in the blockchain",
            parameters: [
                { name: "file", type: "File", description: "The file to upload", required: true },
                { name: "metadata", type: "Object", description: "Additional metadata for the file", required: false },
            ],
            response: '{ transactionHash: string, ipfsHash: string }',
            example: `const formData = new FormData();
formData.append('file', fileObject);
formData.append('metadata', JSON.stringify({
  name: 'My Document',
  tags: ['important']
}));

const res = await fetch('/api/v1/files/developer/upload', {
  method: 'POST',
  body: formData,
  headers: { 'x-api-key': 'YOUR_API_KEY' }
});
const data = await res.json();
// { transactionHash: '0x...', ipfsHash: 'Qm...' }`,
        },
        {
            name: "List User Files",
            method: "GET",
            endpoint: "/api/v1/files/developer/files-with-urls",
            description: "Get all files owned by a wallet address with their URLs",
            parameters: [
                { name: "walletAddress", type: "string", description: "Ethereum wallet address", required: true },
            ],
            response: 'Array<{ fileName: string, ipfsHash: string, url: string }>',
            example: `const res = await fetch(
  '/api/v1/files/developer/files-with-urls' +
  '?walletAddress=0x742d35Cc...4438f44e',
  { headers: { 'x-api-key': 'YOUR_API_KEY' } }
);
const files = await res.json();`,
        },
        {
            name: "Delete File",
            method: "DELETE",
            endpoint: "/api/v1/files/developer/delete",
            description: "Delete a file from the system by its IPFS hash",
            parameters: [
                { name: "fileHash", type: "string", description: "IPFS hash of the file to delete", required: true },
            ],
            example: `await fetch('/api/v1/files/developer/delete', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    fileHash: 'QmZ9WnKgPAVJLNRWJj...'
  })
});`,
        },
        {
            name: "Update File Metadata",
            method: "PUT",
            endpoint: "/api/v1/files/developer/update-metadata",
            description: "Update metadata associated with an existing file",
            parameters: [
                { name: "fileHash", type: "string", description: "IPFS hash of the file", required: true },
                { name: "metadata", type: "Object", description: "New metadata to associate with the file", required: true },
            ],
            example: `await fetch('/api/v1/files/developer/update-metadata', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    fileHash: 'QmZ9WnKg...',
    metadata: { title: 'Updated Title', tags: ['v2'] }
  })
});`,
        },
        {
            name: "Search Files",
            method: "GET",
            endpoint: "/api/v1/files/developer/search",
            description: "Search for files using a query string",
            parameters: [
                { name: "query", type: "string", description: "Search query string", required: true },
            ],
            response: 'Array<{ fileName: string, ipfsHash: string, metadata: Object }>',
            example: `const res = await fetch(
  '/api/v1/files/developer/search?query=invoice',
  { headers: { 'x-api-key': 'YOUR_API_KEY' } }
);
const results = await res.json();`,
        },
        {
            name: "Get File Metadata",
            method: "GET",
            endpoint: "/developer/get-file-metadata",
            description: "Retrieve detailed metadata about a specific file",
            parameters: [
                { name: "fileHash", type: "string", description: "IPFS hash of the file", required: true },
            ],
            response: '{ metadata: Object, createdAt: string, owner: string }',
            comingSoon: true,
        },
    ],
    "Transaction Management": [
        {
            name: "Fetch Transactions",
            method: "GET",
            endpoint: "/api/v1/files/developer/transactions",
            description: "Get all transactions for a specific wallet address",
            parameters: [
                { name: "walletAddress", type: "string", description: "Ethereum wallet address", required: true },
            ],
            example: `const res = await fetch(
  '/api/v1/files/developer/transactions' +
  '?walletAddress=0x742d35Cc...4438f44e',
  { headers: { 'x-api-key': 'YOUR_API_KEY' } }
);
const txns = await res.json();`,
        },
        {
            name: "Get Transaction Details",
            method: "GET",
            endpoint: "/api/v1/files/developer/transaction-details",
            description: "Get detailed information about a specific transaction",
            parameters: [
                { name: "txHash", type: "string", description: "Transaction hash", required: true },
            ],
            example: `const res = await fetch(
  '/api/v1/files/developer/transaction-details' +
  '?txHash=0x5a4bf697...',
  { headers: { 'x-api-key': 'YOUR_API_KEY' } }
);
const detail = await res.json();`,
        },
        {
            name: "Get Recent Transactions",
            method: "GET",
            endpoint: "/api/v1/files/developer/recent-transactions",
            description: "Retrieve the most recent transactions in the system",
            parameters: [
                { name: "limit", type: "number", description: "Number of transactions to return", required: false },
            ],
            response: 'Array<{ txHash: string, timestamp: string, type: string }>',
            example: `const res = await fetch(
  '/api/v1/files/developer/recent-transactions?limit=10',
  { headers: { 'x-api-key': 'YOUR_API_KEY' } }
);`,
        },
    ],
    "Blockchain Stats": [
        {
            name: "Get Blockchain Stats",
            method: "GET",
            endpoint: "/api/v1/files/developer/blockchain-stats",
            description: "Retrieve general statistics about blockchain usage",
            response: '{ totalFiles: number, totalUsers: number, totalTransactions: number }',
            example: `const res = await fetch('/developer/get-blockchain-stats', {
  headers: { 'x-api-key': 'YOUR_API_KEY' }
});
const stats = await res.json();`,
        },
        {
            name: "Get User Balance",
            method: "GET",
            endpoint: "/api/v1/files/developer/balance",
            description: "Get the current ETH balance for a wallet address",
            parameters: [
                { name: "walletAddress", type: "string", description: "Ethereum wallet address", required: true },
            ],
            response: '{ balance: string, currency: string }',
            example: `const res = await fetch(
  '/api/v1/files/developer/balance' +
  '?walletAddress=0x742d35Cc...4438f44e',
  { headers: { 'x-api-key': 'YOUR_API_KEY' } }
);`,
        },
        {
            name: "Verify File",
            method: "GET",
            endpoint: "/developer/verify-file",
            description: "Verify the authenticity and ownership of a file on the blockchain",
            parameters: [
                { name: "fileHash", type: "string", description: "IPFS hash of the file to verify", required: true },
                { name: "ownerAddress", type: "string", description: "Expected owner's wallet address", required: true },
            ],
            response: '{ verified: boolean, owner: string, timestamp: string }',
            comingSoon: true,
        },
    ],
}

const methodColors = {
    GET:    { bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)', text: '#34D399' },
    POST:   { bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.3)', text: '#60A5FA' },
    PUT:    { bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.3)', text: '#A78BFA' },
    DELETE: { bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.3)', text: '#F87171' },
}

const categories = [
    { name: "File Management", icon: FolderOutlinedIcon, desc: "Upload, retrieve & manage files" },
    { name: "Transaction Management", icon: CodeIcon, desc: "Query blockchain transactions" },
    { name: "Blockchain Stats", icon: BarChartOutlinedIcon, desc: "Usage stats & analytics" },
]

const CopyButton = ({ text }) => {
    const [copied, setCopied] = useState(false)
    const handle = () => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    return (
        <Box component="button" onClick={handle} sx={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px', px: 1.2, py: 0.5, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 0.6,
            color: copied ? '#4ADE80' : '#9E9E8E',
            transition: 'all 0.2s', fontSize: '0.7rem',
            '&:hover': { background: 'rgba(255,255,255,0.08)', color: '#F5F0E8' },
        }}>
            {copied ? <CheckIcon sx={{ fontSize: '0.8rem' }} /> : <ContentCopyIcon sx={{ fontSize: '0.8rem' }} />}
            {copied ? 'Copied' : 'Copy'}
        </Box>
    )
}

const MethodBadge = ({ method }) => {
    const c = methodColors[method] || methodColors.GET
    return (
        <Box sx={{
            px: 1.4, py: 0.3, borderRadius: '6px',
            background: c.bg, border: `1px solid ${c.border}`,
            color: c.text, fontSize: '0.68rem', fontWeight: 700,
            fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.06em',
            flexShrink: 0,
        }}>
            {method}
        </Box>
    )
}

const EndpointCard = ({ ep, index }) => {
    const [open, setOpen] = useState(false)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.07 }}
        >
            <Box sx={{
                background: '#242424',
                border: '1px solid #2E2E2E',
                borderRadius: '14px',
                mb: 2,
                overflow: 'hidden',
                transition: 'border-color 0.25s',
                ...(open && { borderColor: 'rgba(201,168,76,0.25)' }),
                '&:hover': { borderColor: open ? 'rgba(201,168,76,0.25)' : '#3A3A3A' },
            }}>
                {/* Header row */}
                <Box
                    onClick={() => !ep.comingSoon && setOpen(v => !v)}
                    sx={{
                        display: 'flex', alignItems: 'center', gap: 2, p: 2.5,
                        cursor: ep.comingSoon ? 'default' : 'pointer',
                        userSelect: 'none',
                    }}
                >
                    <MethodBadge method={ep.method} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                            <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.82rem', color: '#F5F0E8', letterSpacing: '0.02em' }}>
                                {ep.endpoint}
                            </Typography>
                            {ep.comingSoon && (
                                <Chip label="Soon" size="small" sx={{
                                    height: 18, fontSize: '0.6rem', letterSpacing: '0.08em',
                                    background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)',
                                    color: '#C9A84C',
                                }} />
                            )}
                        </Box>
                        <Typography sx={{ fontSize: '0.75rem', color: '#555', mt: 0.3 }}>{ep.name}</Typography>
                    </Box>
                    {!ep.comingSoon && (
                        <Box sx={{ color: '#555', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                            {open ? <KeyboardArrowUpIcon sx={{ fontSize: '1.2rem' }} /> : <KeyboardArrowDownIcon sx={{ fontSize: '1.2rem' }} />}
                        </Box>
                    )}
                </Box>

                {/* Expanded body */}
                <Collapse in={open}>
                    <Box sx={{ px: 3, pb: 3, borderTop: '1px solid #2A2A2A' }}>
                        <Typography sx={{ color: '#9E9E8E', fontSize: '0.83rem', lineHeight: 1.75, pt: 2.5, mb: 3 }}>
                            {ep.description}
                        </Typography>

                        {/* Parameters */}
                        {ep.parameters?.length > 0 && (
                            <Box sx={{ mb: 3 }}>
                                <Typography sx={{ fontSize: '0.65rem', color: '#555', letterSpacing: '0.15em', textTransform: 'uppercase', mb: 1.5, fontFamily: '"Inter", sans-serif' }}>
                                    Parameters
                                </Typography>
                                <Box sx={{ background: '#1E1E1E', borderRadius: '10px', border: '1px solid #2A2A2A', overflow: 'hidden' }}>
                                    {ep.parameters.map((p, i) => (
                                        <Box key={p.name} sx={{
                                            display: 'flex', alignItems: 'flex-start', gap: 2, p: 2,
                                            borderBottom: i < ep.parameters.length - 1 ? '1px solid #252525' : 'none',
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, minWidth: 140 }}>
                                                <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.78rem', color: '#C9A84C' }}>
                                                    {p.name}
                                                </Typography>
                                                {p.required && (
                                                    <Box sx={{ width: 4, height: 4, borderRadius: '50%', background: '#F87171', flexShrink: 0 }} />
                                                )}
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                                                <Typography sx={{ fontSize: '0.7rem', color: '#60A5FA', fontFamily: '"JetBrains Mono", monospace', flexShrink: 0 }}>
                                                    {p.type}
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.75rem', color: '#777' }}>{p.description}</Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                    <Box sx={{ width: 4, height: 4, borderRadius: '50%', background: '#F87171' }} />
                                    <Typography sx={{ fontSize: '0.65rem', color: '#444' }}>required field</Typography>
                                </Box>
                            </Box>
                        )}

                        {/* Response */}
                        {ep.response && (
                            <Box sx={{ mb: 3 }}>
                                <Typography sx={{ fontSize: '0.65rem', color: '#555', letterSpacing: '0.15em', textTransform: 'uppercase', mb: 1.5 }}>
                                    Response
                                </Typography>
                                <Box sx={{
                                    background: '#1A1A1A', borderRadius: '10px', border: '1px solid #2A2A2A',
                                    p: 2, fontFamily: '"JetBrains Mono", monospace', fontSize: '0.78rem',
                                    color: '#34D399', lineHeight: 1.7,
                                }}>
                                    {ep.response}
                                </Box>
                            </Box>
                        )}

                        {/* Example */}
                        {ep.example && (
                            <Box>
                                <Typography sx={{ fontSize: '0.65rem', color: '#555', letterSpacing: '0.15em', textTransform: 'uppercase', mb: 1.5 }}>
                                    Example
                                </Typography>
                                <Box sx={{ position: 'relative', background: '#161616', borderRadius: '10px', border: '1px solid #222', overflow: 'hidden' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2.5, py: 1.5, borderBottom: '1px solid #222' }}>
                                        <Box sx={{ display: 'flex', gap: 0.8 }}>
                                            {['#F87171','#FBBF24','#34D399'].map(c => (
                                                <Box key={c} sx={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.5 }} />
                                            ))}
                                        </Box>
                                        <CopyButton text={ep.example} />
                                    </Box>
                                    <Box sx={{ p: 2.5, overflowX: 'auto' }}>
                                        <pre style={{
                                            margin: 0,
                                            fontFamily: '"JetBrains Mono", monospace',
                                            fontSize: '0.78rem',
                                            lineHeight: 1.8,
                                            color: '#C8C8C8',
                                            whiteSpace: 'pre',
                                        }}>
                                            {ep.example}
                                        </pre>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Collapse>
            </Box>
        </motion.div>
    )
}

export default function DocsPage() {
    const [selectedCategory, setSelectedCategory] = useState("File Management")

    return (
        <Box sx={{ background: '#1A1A1A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            {/* Hero */}
            <Box sx={{
                py: { xs: 10, md: 14 },
                background: 'radial-gradient(ellipse at 50% 0%, rgba(42,32,16,0.8) 0%, #1A1A1A 60%)',
                position: 'relative', overflow: 'hidden', textAlign: 'center',
            }}>
                <Box sx={{
                    position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                    width: 600, height: 250,
                    background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <Chip label="⬡ REST API · v1" size="small" sx={{
                            mb: 3, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)',
                            color: '#C9A84C', fontSize: '0.7rem', letterSpacing: '0.05em',
                        }} />
                        <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, fontWeight: 700, mb: 2, letterSpacing: '-0.02em' }}>
                            API{' '}
                            <Box component="span" sx={{ background: 'linear-gradient(135deg, #C9A84C, #E8B94F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                Reference
                            </Box>
                        </Typography>
                        <Typography sx={{ color: '#9E9E8E', fontSize: '1.05rem', maxWidth: 500, mx: 'auto', lineHeight: 1.8 }}>
                            Integrate blockchain file authentication into your applications with our REST API.
                        </Typography>
                    </motion.div>

                    {/* Quick info strip */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 5, flexWrap: 'wrap' }}>
                            {[
                                { icon: <LockOutlinedIcon sx={{ fontSize: '0.9rem' }} />, label: 'Auth: x-api-key header' },
                                { icon: <CodeIcon sx={{ fontSize: '0.9rem' }} />, label: 'Base: /api/v1' },
                                { icon: <RocketLaunchOutlinedIcon sx={{ fontSize: '0.9rem' }} />, label: 'Format: JSON' },
                            ].map(s => (
                                <Box key={s.label} sx={{
                                    display: 'flex', alignItems: 'center', gap: 1,
                                    px: 2.5, py: 1,
                                    background: '#242424', border: '1px solid #2E2E2E', borderRadius: '20px',
                                    color: '#9E9E8E', fontSize: '0.75rem',
                                }}>
                                    {s.icon}
                                    <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', color: '#9E9E8E' }}>
                                        {s.label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </motion.div>
                </Container>
            </Box>

            {/* Content */}
            <Container maxWidth="lg" sx={{ flex: 1, py: { xs: 6, md: 10 }, pb: 14 }}>
                <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>

                    {/* Sidebar */}
                    <Box sx={{ flexShrink: 0, width: { xs: '100%', md: 220 } }}>
                        <Typography sx={{ fontSize: '0.65rem', color: '#444', letterSpacing: '0.2em', textTransform: 'uppercase', mb: 2, fontFamily: '"Inter", sans-serif' }}>
                            Categories
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'row', md: 'column' }, gap: 1, flexWrap: 'wrap' }}>
                            {categories.map(cat => {
                                const Icon = cat.icon
                                const active = selectedCategory === cat.name
                                return (
                                    <Box
                                        key={cat.name}
                                        onClick={() => setSelectedCategory(cat.name)}
                                        sx={{
                                            display: 'flex', alignItems: 'center', gap: 1.5,
                                            px: 2, py: 1.5, borderRadius: '10px', cursor: 'pointer',
                                            background: active ? 'rgba(201,168,76,0.08)' : 'transparent',
                                            border: `1px solid ${active ? 'rgba(201,168,76,0.2)' : 'transparent'}`,
                                            transition: 'all 0.2s',
                                            '&:hover': { background: active ? 'rgba(201,168,76,0.1)' : '#232323' },
                                        }}
                                    >
                                        <Icon sx={{ fontSize: '1rem', color: active ? '#C9A84C' : '#555', flexShrink: 0 }} />
                                        <Box>
                                            <Typography sx={{ fontSize: '0.8rem', color: active ? '#F5F0E8' : '#9E9E8E', fontWeight: active ? 600 : 400, lineHeight: 1.2 }}>
                                                {cat.name}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.65rem', color: '#444', display: { xs: 'none', md: 'block' } }}>
                                                {cat.desc}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )
                            })}
                        </Box>

                        {/* Auth box */}
                        <Box sx={{ mt: 4, p: 2.5, background: '#1E1E1E', border: '1px solid #272727', borderRadius: '12px', display: { xs: 'none', md: 'block' } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                <LockOutlinedIcon sx={{ fontSize: '0.85rem', color: '#C9A84C' }} />
                                <Typography sx={{ fontSize: '0.7rem', color: '#C9A84C', fontWeight: 600, letterSpacing: '0.08em' }}>AUTHENTICATION</Typography>
                            </Box>
                            <Typography sx={{ fontSize: '0.72rem', color: '#555', lineHeight: 1.7, mb: 1.5 }}>
                                Include your API key in every request header:
                            </Typography>
                            <Box sx={{ background: '#161616', borderRadius: '8px', p: 1.5, fontFamily: '"JetBrains Mono", monospace', fontSize: '0.7rem', color: '#C9A84C' }}>
                                x-api-key: YOUR_KEY
                            </Box>
                        </Box>
                    </Box>

                    {/* Endpoint list */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '1.2rem' }}>{selectedCategory}</Typography>
                                <Typography sx={{ color: '#555', fontSize: '0.78rem', mt: 0.3 }}>
                                    {apiEndpoints[selectedCategory]?.length} endpoints
                                </Typography>
                            </Box>
                            <Chip
                                label={`v1`}
                                size="small"
                                sx={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)', color: '#C9A84C', fontSize: '0.65rem' }}
                            />
                        </Box>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedCategory}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                            >
                                {apiEndpoints[selectedCategory]?.map((ep, i) => (
                                    <EndpointCard key={ep.name} ep={ep} index={i} />
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </Box>
                </Box>
            </Container>

            <Footer />
        </Box>
    )
}
