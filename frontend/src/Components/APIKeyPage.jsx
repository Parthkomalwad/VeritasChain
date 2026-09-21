import { useState, useEffect } from "react"
import {
    Box, Container, Typography, Button, TextField, IconButton,
    Tooltip, Alert, Divider, CircularProgress, Chip,
} from "@mui/material"
import {
    ContentCopy as CopyIcon,
    Refresh as RefreshIcon,
    VpnKeyOutlined as KeyIcon,
    ShieldOutlined as ShieldIcon,
    Check as CheckIcon,
    AccountBalanceWalletOutlined as WalletIcon,
    LockOutlined as LockIcon,
    CodeOutlined as CodeIcon,
    VisibilityOffOutlined as HideIcon,
} from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "../Micro-Components/Navbar"
import Footer from "../Micro-Components/Footer"

export default function APIKeyPage() {
    const [walletAddress, setWalletAddress] = useState("")
    const [apiKey, setApiKey] = useState(null)
    const [copied, setCopied] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [revealed, setRevealed] = useState(false)

    useEffect(() => {
        const fetchWallet = async () => {
            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
                    if (accounts.length > 0) setWalletAddress(accounts[0])
                } catch (e) { console.error(e) }
            }
        }
        fetchWallet()
    }, [])

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
                if (accounts.length > 0) { setWalletAddress(accounts[0]); setError("") }
                else setError("No accounts found.")
            } catch { setError("Failed to connect wallet.") }
        } else {
            setError("MetaMask is not installed.")
        }
    }

    const generateApiKey = async () => {
        if (!walletAddress) { setError("Please connect your wallet first"); return }
        setLoading(true); setError("")
        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/api/v1/api-keys/generate?user_address=${walletAddress}`,
                { method: "POST", headers: { "Content-Type": "application/json" } }
            )
            if (!res.ok) throw new Error("Failed to generate API key")
            const data = await res.json()
            setApiKey(data.apiKey)
            setSuccess("API key generated successfully.")
            setRevealed(false)
        } catch (err) { setError(err.message) }
        finally { setLoading(false) }
    }

    const regenerateApiKey = async () => {
        if (!walletAddress) { setError("Please connect your wallet first"); return }
        setLoading(true); setError("")
        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/api/v1/api-keys/regenerate?user_address=${walletAddress}`,
                { method: "POST", headers: { "Content-Type": "application/json" } }
            )
            if (!res.ok) throw new Error("Failed to regenerate API key")
            const data = await res.json()
            setApiKey(data.apiKey)
            setSuccess("API key regenerated.")
            setRevealed(false)
        } catch (err) { setError(err.message) }
        finally { setLoading(false) }
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(apiKey)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch { setError("Failed to copy.") }
    }

    const formatAddr = (a) => !a ? '' : `${a.slice(0, 6)}...${a.slice(-4)}`
    const maskedKey = apiKey ? `${apiKey.slice(0, 8)}${'•'.repeat(24)}${apiKey.slice(-4)}` : ''

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#1A1A1A", display: "flex", flexDirection: "column" }}>
            <Navbar />

            {/* Hero */}
            <Box sx={{
                py: { xs: 10, md: 14 },
                background: 'radial-gradient(ellipse at 50% 0%, rgba(42,32,16,0.85) 0%, #1A1A1A 60%)',
                position: 'relative', overflow: 'hidden', textAlign: 'center',
            }}>
                <Box sx={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'linear-gradient(rgba(201,168,76,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.025) 1px, transparent 1px)',
                    backgroundSize: '60px 60px', pointerEvents: 'none',
                }} />
                <Box sx={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 600, height: 280, background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <Chip label="⬡ Developer Access" size="small" sx={{ mb: 3, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: '#C9A84C', fontSize: '0.7rem', letterSpacing: '0.05em' }} />
                        <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, fontWeight: 700, mb: 2, letterSpacing: '-0.02em' }}>
                            API{' '}
                            <Box component="span" sx={{ background: 'linear-gradient(135deg, #C9A84C, #E8B94F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                Keys
                            </Box>
                        </Typography>
                        <Typography sx={{ color: '#9E9E8E', fontSize: '1rem', maxWidth: 440, mx: 'auto', lineHeight: 1.8 }}>
                            Integrate VeritasChain into your applications. Authenticate with your wallet, get your key.
                        </Typography>
                    </motion.div>
                </Container>
            </Box>

            {/* Main content */}
            <Container maxWidth="sm" sx={{ flex: 1, py: { xs: 6, md: 8 }, pb: 14 }}>
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>

                    {/* Alerts */}
                    <AnimatePresence>
                        {error && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', '& .MuiAlert-icon': { color: '#f87171' } }}>
                                    {error}
                                </Alert>
                            </motion.div>
                        )}
                        {success && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                <Alert severity="success" sx={{ mb: 3, borderRadius: '12px', background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ADE80', '& .MuiAlert-icon': { color: '#4ADE80' } }}>
                                    {success}
                                </Alert>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Card */}
                    <Box sx={{ background: '#242424', border: '1px solid #2E2E2E', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.3)' }}>

                        {/* Wallet section */}
                        <Box sx={{ p: { xs: 3, md: 4 }, borderBottom: '1px solid #2A2A2A' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <WalletIcon sx={{ color: '#C9A84C', fontSize: '1.1rem' }} />
                                <Typography sx={{ fontSize: '0.72rem', color: '#9E9E8E', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                    Connected Wallet
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch' }}>
                                <Box sx={{
                                    flex: 1, px: 2, py: 1.5,
                                    background: '#1A1A1A', border: '1px solid #333', borderRadius: '12px',
                                    display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0,
                                }}>
                                    {walletAddress ? (
                                        <>
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 8px #4ADE80', flexShrink: 0 }} />
                                            <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.82rem', color: '#C9A84C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {walletAddress}
                                            </Typography>
                                        </>
                                    ) : (
                                        <>
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#555', flexShrink: 0 }} />
                                            <Typography sx={{ fontSize: '0.82rem', color: '#444' }}>No wallet connected</Typography>
                                        </>
                                    )}
                                </Box>
                                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={connectWallet}
                                        sx={{
                                            borderColor: 'rgba(201,168,76,0.3)', color: '#C9A84C',
                                            borderRadius: '12px', px: 2.5, py: 1.5, height: '100%',
                                            fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap',
                                            '&:hover': { borderColor: '#C9A84C', background: 'rgba(201,168,76,0.06)' },
                                        }}
                                    >
                                        {walletAddress ? 'Switch' : 'Connect'}
                                    </Button>
                                </motion.div>
                            </Box>
                        </Box>

                        {/* API Key section */}
                        <Box sx={{ p: { xs: 3, md: 4 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <KeyIcon sx={{ color: '#C9A84C', fontSize: '1.1rem' }} />
                                <Typography sx={{ fontSize: '0.72rem', color: '#9E9E8E', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                    Your API Key
                                </Typography>
                            </Box>

                            {apiKey ? (
                                <AnimatePresence>
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                        {/* Key display */}
                                        <Box sx={{
                                            background: '#161616', border: '1px solid #2A2A2A', borderRadius: '12px',
                                            p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5,
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                                                <LockIcon sx={{ color: '#555', fontSize: '0.9rem', flexShrink: 0 }} />
                                                <Typography sx={{
                                                    fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8rem',
                                                    color: revealed ? '#C9A84C' : '#666',
                                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                    letterSpacing: revealed ? '0.02em' : '0.1em',
                                                }}>
                                                    {revealed ? apiKey : maskedKey}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                                                <Tooltip title={revealed ? "Hide" : "Reveal"}>
                                                    <IconButton size="small" onClick={() => setRevealed(v => !v)}
                                                        sx={{ color: '#555', '&:hover': { color: '#C9A84C', background: 'rgba(201,168,76,0.08)' }, borderRadius: '8px', p: 0.8 }}>
                                                        <HideIcon sx={{ fontSize: '1rem' }} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title={copied ? "Copied!" : "Copy"}>
                                                    <IconButton size="small" onClick={copyToClipboard}
                                                        sx={{ color: copied ? '#4ADE80' : '#555', '&:hover': { color: '#C9A84C', background: 'rgba(201,168,76,0.08)' }, borderRadius: '8px', p: 0.8 }}>
                                                        {copied ? <CheckIcon sx={{ fontSize: '1rem' }} /> : <CopyIcon sx={{ fontSize: '1rem' }} />}
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </Box>

                                        {/* Regenerate */}
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                onClick={regenerateApiKey}
                                                disabled={loading}
                                                startIcon={loading ? <CircularProgress size={16} sx={{ color: '#C9A84C' }} /> : <RefreshIcon sx={{ fontSize: '1rem' }} />}
                                                sx={{
                                                    borderColor: 'rgba(201,168,76,0.25)', color: '#C9A84C',
                                                    borderRadius: '12px', py: 1.2, fontSize: '0.82rem',
                                                    '&:hover': { borderColor: '#C9A84C', background: 'rgba(201,168,76,0.05)' },
                                                    '&:disabled': { borderColor: '#2E2E2E', color: '#444' },
                                                }}
                                            >
                                                Regenerate Key
                                            </Button>
                                        </motion.div>
                                    </motion.div>
                                </AnimatePresence>
                            ) : (
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={generateApiKey}
                                        disabled={loading || !walletAddress}
                                        startIcon={loading ? <CircularProgress size={18} sx={{ color: '#1A1A1A' }} /> : <KeyIcon sx={{ fontSize: '1.1rem' }} />}
                                        sx={{
                                            py: 1.6, borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600,
                                            background: 'linear-gradient(135deg, #C9A84C 0%, #E8B94F 100%)',
                                            color: '#1A1A1A',
                                            boxShadow: '0 0 30px rgba(201,168,76,0.2)',
                                            '&:hover': { background: 'linear-gradient(135deg, #D4B05A, #F0C456)', boxShadow: '0 0 40px rgba(201,168,76,0.35)' },
                                            '&:disabled': { background: '#2E2E2E', color: '#444', boxShadow: 'none' },
                                        }}
                                    >
                                        Generate API Key
                                    </Button>
                                </motion.div>
                            )}

                            {/* Security notice */}
                            <Box sx={{ mt: 3, p: 2.5, background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: '12px', display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                <ShieldIcon sx={{ color: 'rgba(201,168,76,0.6)', fontSize: '1rem', mt: 0.2, flexShrink: 0 }} />
                                <Typography sx={{ fontSize: '0.75rem', color: '#555', lineHeight: 1.7 }}>
                                    Keep your API key secret. Never expose it in client-side code or commit it to version control.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Usage example */}
                    <Box sx={{ mt: 4, background: '#242424', border: '1px solid #2E2E2E', borderRadius: '20px', overflow: 'hidden' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2, borderBottom: '1px solid #2A2A2A' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CodeIcon sx={{ color: '#C9A84C', fontSize: '1rem' }} />
                                <Typography sx={{ fontSize: '0.72rem', color: '#9E9E8E', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                    Usage Example
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.6 }}>
                                {['#F87171', '#FBBF24', '#34D399'].map(c => <Box key={c} sx={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.5 }} />)}
                            </Box>
                        </Box>
                        <Box sx={{ p: 3 }}>
                            <pre style={{ margin: 0, fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', lineHeight: 1.8, color: '#666', overflowX: 'auto' }}>
{`fetch('/api/v1/files/developer/upload', {
  method: 'POST',
  headers: {
    'x-api-key': '`}<span style={{ color: '#C9A84C' }}>YOUR_API_KEY</span>{`'
  },
  body: formData
})`}
                            </pre>
                        </Box>
                    </Box>

                    {/* Docs link */}
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Button href="/docs" sx={{ color: '#555', fontSize: '0.78rem', '&:hover': { color: '#C9A84C', background: 'transparent' } }}>
                            View full API reference →
                        </Button>
                    </Box>
                </motion.div>
            </Container>

            <Footer />
        </Box>
    )
}
