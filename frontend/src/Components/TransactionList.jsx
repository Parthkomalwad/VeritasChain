import { useState, useEffect } from "react"
import axios from "axios"
import {
    Box, Typography, Modal, Button, IconButton, Container, Chip,
    Tooltip, Skeleton, TextField, InputAdornment, styled, alpha,
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import {
    Search as SearchIcon,
    Visibility as VisibilityIcon,
    ContentCopy as ContentCopyIcon,
    AccountBalanceWallet as WalletIcon,
    ArrowBack as ArrowBackIcon,
    InsertDriveFile as FileIcon,
    Image as ImageIcon,
    PictureAsPdf as PdfIcon,
    Description as TextIcon,
    Code as CodeIcon,
    Article as ArticleIcon,
    TableChart as TableChartIcon,
    Download as DownloadIcon,
    Close as CloseIcon,
    Check as CheckIcon,
    VerifiedOutlined as VerifiedIcon,
} from "@mui/icons-material"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, useParams } from "react-router-dom"
import Navbar from "../Micro-Components/Navbar"
import Footer from "../Micro-Components/Footer"

const API_URL = process.env.REACT_APP_API_BASE_URL

const LedgerWatermark = () => (
    <Box sx={{
        position: 'absolute', bottom: 12, right: 16,
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '7px', opacity: 0.05, color: '#C9A84C',
        letterSpacing: '4px', userSelect: 'text', pointerEvents: 'none',
    }}>
        -.- ---
    </Box>
)

const StyledDataGrid = styled(DataGrid)(() => ({
    border: "none",
    color: "#F5F0E8",
    fontFamily: '"Inter", sans-serif',
    "& .MuiDataGrid-columnHeaders": {
        backgroundColor: "#242424",
        color: "#9E9E8E",
        fontWeight: 600,
        fontSize: "0.72rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        borderBottom: "1px solid #2E2E2E",
    },
    "& .MuiDataGrid-cell": {
        borderBottom: "1px solid rgba(46,46,46,0.5)",
        fontSize: "0.85rem",
        display: "flex",
        alignItems: "center",
    },
    "& .MuiDataGrid-row": {
        transition: "background 0.15s",
    },
    "& .MuiDataGrid-row:hover": {
        backgroundColor: "rgba(201,168,76,0.06)",
    },
    "& .MuiDataGrid-footerContainer": {
        backgroundColor: "#1A1A1A",
        borderTop: "1px solid #2E2E2E",
        color: "#9E9E8E",
    },
    "& .MuiTablePagination-root": { color: "#9E9E8E" },
    "& .MuiButtonBase-root": { color: "#9E9E8E" },
    "& .MuiDataGrid-columnSeparator": { display: "none" },
    "& .MuiDataGrid-overlay": { backgroundColor: "#1A1A1A" },
}))

const getFileTypeFromName = (fileName) => {
    if (!fileName) return 'application/octet-stream'
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (['jpg','jpeg','png','gif','webp','svg','bmp','ico'].includes(ext)) return 'image/' + ext
    if (ext === 'pdf') return 'application/pdf'
    if (['mp4','webm','ogg','mov','avi','mkv','wmv','flv'].includes(ext)) return 'video/' + ext
    if (['mp3','wav','ogg','flac','aac','m4a'].includes(ext)) return 'audio/' + ext
    if (['js','jsx','ts','tsx'].includes(ext)) return 'code/javascript'
    if (ext === 'py') return 'code/python'
    if (ext === 'sol') return 'code/solidity'
    if (ext === 'json') return 'code/json'
    if (['html','htm'].includes(ext)) return 'code/html'
    if (ext === 'css') return 'code/css'
    if (ext === 'rs') return 'code/rust'
    if (ext === 'go') return 'code/go'
    if (['sh','bash'].includes(ext)) return 'code/shell'
    if (['yaml','yml'].includes(ext)) return 'code/yaml'
    if (ext === 'md') return 'text/markdown'
    if (ext === 'csv') return 'text/csv'
    if (['txt','log'].includes(ext)) return 'text/plain'
    if (['doc','docx'].includes(ext)) return 'application/word'
    return 'application/octet-stream'
}

const getFileTypeIcon = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    const ft = getFileTypeFromName(fileName)
    if (ext === 'pdf') return <PdfIcon sx={{ color: "#f87171", fontSize: '1.1rem' }} />
    if (['jpg','jpeg','png','gif','svg','webp'].includes(ext)) return <ImageIcon sx={{ color: "#C9A84C", fontSize: '1.1rem' }} />
    if (ft?.startsWith('code/')) return <CodeIcon sx={{ color: '#60a5fa', fontSize: '1.1rem' }} />
    if (ft === 'text/markdown') return <ArticleIcon sx={{ color: '#C9A84C', fontSize: '1.1rem' }} />
    if (ft === 'text/csv') return <TableChartIcon sx={{ color: '#4CAF7D', fontSize: '1.1rem' }} />
    if (['txt','doc','docx'].includes(ext)) return <TextIcon sx={{ color: "#60a5fa", fontSize: '1.1rem' }} />
    return <FileIcon sx={{ color: "#9ca3af", fontSize: '1.1rem' }} />
}

const FilePreviewModal = ({ open, onClose, fileUrl, fileType, fileName }) => {
    const [fileContent, setFileContent] = useState(null)

    useEffect(() => {
        if (!fileUrl || !fileType) { setFileContent(null); return }
        if (fileType?.startsWith('code/') || fileType === 'text/markdown' || fileType === 'text/csv' || fileType === 'text/plain') {
            axios.get(fileUrl, { responseType: 'text' })
                .then(res => setFileContent(res.data))
                .catch(() => setFileContent(null))
        } else {
            setFileContent(null)
        }
    }, [fileUrl, fileType])

    const handleClose = () => { setFileContent(null); onClose() }

    const DownloadBtn = ({ label }) => (
        <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            component="a" href={fileUrl} download={fileName} target="_blank" rel="noopener noreferrer"
            sx={{ mt: 2, borderColor: 'rgba(201,168,76,0.4)', color: '#C9A84C', borderRadius: '10px', '&:hover': { borderColor: '#C9A84C', background: 'rgba(201,168,76,0.06)' } }}
        >
            {label}
        </Button>
    )

    return (
        <Modal open={open} onClose={handleClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        style={{ width: '100%', maxWidth: 900, maxHeight: '90vh', outline: 'none' }}
                    >
                        <Box sx={{
                            background: '#1E1E1E', borderRadius: '20px',
                            border: '1px solid rgba(201,168,76,0.2)',
                            boxShadow: '0 40px 120px rgba(0,0,0,0.7)',
                            overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh',
                        }}>
                            {/* Modal header */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2, borderBottom: '1px solid #2A2A2A' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    {getFileTypeIcon(fileName)}
                                    <Box>
                                        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#F5F0E8' }}>{fileName}</Typography>
                                        <Typography sx={{ fontSize: '0.7rem', color: '#555', fontFamily: '"JetBrains Mono", monospace' }}>{fileType || 'Unknown'}</Typography>
                                    </Box>
                                </Box>
                                <IconButton onClick={handleClose} size="small" sx={{ color: '#555', '&:hover': { color: '#F5F0E8', background: '#2E2E2E' } }}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>

                            {/* Modal body */}
                            <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                                {fileUrl && fileType?.startsWith('image/') && (
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Box component="img" src={fileUrl} alt="Preview" sx={{ maxWidth: '100%', maxHeight: 500, objectFit: 'contain', borderRadius: '12px' }} />
                                        <Box><DownloadBtn label="Download Image" /></Box>
                                    </Box>
                                )}
                                {fileUrl && fileType === 'application/pdf' && (
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Box component="iframe" src={fileUrl} title="PDF" sx={{ width: '100%', height: 500, border: 'none', borderRadius: '8px' }} />
                                        <Box><DownloadBtn label="Download PDF" /></Box>
                                    </Box>
                                )}
                                {fileUrl && fileType?.startsWith('audio/') && (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <Box component="audio" controls sx={{ width: '100%', mb: 2 }}>
                                            <source src={fileUrl} type={fileType} />
                                        </Box>
                                        <DownloadBtn label="Download Audio" />
                                    </Box>
                                )}
                                {fileUrl && fileType?.startsWith('video/') && (
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Box component="video" controls sx={{ width: '100%', maxHeight: 480, borderRadius: '8px', mb: 1 }}>
                                            <source src={fileUrl} type={fileType} />
                                        </Box>
                                        <DownloadBtn label="Download Video" />
                                    </Box>
                                )}
                                {fileUrl && fileType?.startsWith('code/') && fileContent && (
                                    <SyntaxHighlighter language={fileType.split('/')[1]} style={atomDark}
                                        customStyle={{ background: '#161616', margin: 0, fontSize: '0.78rem', borderRadius: '10px' }} showLineNumbers>
                                        {fileContent}
                                    </SyntaxHighlighter>
                                )}
                                {fileUrl && fileType === 'text/markdown' && fileContent && (
                                    <Box sx={{
                                        p: 3, background: '#161616', borderRadius: '10px', border: '1px solid #2E2E2E',
                                        '& h1,& h2,& h3': { color: '#F5F0E8', fontFamily: '"Playfair Display", serif' },
                                        '& p': { color: '#9E9E8E', lineHeight: 1.8 },
                                        '& code': { background: '#242424', color: '#C9A84C', padding: '2px 6px', borderRadius: '4px', fontFamily: '"JetBrains Mono", monospace' },
                                        '& a': { color: '#C9A84C' },
                                        '& blockquote': { borderLeft: '3px solid #C9A84C', paddingLeft: '1rem', color: '#9E9E8E' },
                                    }}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{fileContent}</ReactMarkdown>
                                    </Box>
                                )}
                                {fileUrl && fileType === 'text/csv' && fileContent && (() => {
                                    const lines = fileContent.split('\n').filter(l => l.trim())
                                    const headers = lines[0] ? lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '')) : []
                                    const rows = lines.slice(1, 51).map(line => {
                                        const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
                                        return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']))
                                    })
                                    return (
                                        <Box sx={{ borderRadius: '10px', border: '1px solid #2E2E2E', overflow: 'auto' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                                                <thead>
                                                    <tr>{headers.map(h => <th key={h} style={{ padding: '8px 12px', background: '#1E1E1E', color: '#C9A84C', textAlign: 'left', borderBottom: '1px solid #2E2E2E', whiteSpace: 'nowrap' }}>{h}</th>)}</tr>
                                                </thead>
                                                <tbody>
                                                    {rows.map((row, i) => (
                                                        <tr key={i} style={{ background: i % 2 === 0 ? '#161616' : '#1A1A1A' }}>
                                                            {headers.map(h => <td key={h} style={{ padding: '6px 12px', color: '#F5F0E8', borderBottom: '1px solid #252525' }}>{String(row[h] ?? '')}</td>)}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </Box>
                                    )
                                })()}
                                {fileUrl && fileType === 'text/plain' && fileContent && (
                                    <Box sx={{ p: 3, background: '#161616', borderRadius: '10px', border: '1px solid #2E2E2E', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.78rem', color: '#F5F0E8', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                        {fileContent}
                                    </Box>
                                )}
                                {fileUrl && fileType === 'application/word' && (
                                    <Box sx={{ p: 4, textAlign: 'center', background: '#161616', borderRadius: '10px', border: '1px solid #2E2E2E' }}>
                                        <Typography sx={{ color: '#9E9E8E', mb: 2 }}>Word documents cannot be previewed in browser.</Typography>
                                        <DownloadBtn label="Download to View" />
                                    </Box>
                                )}
                                {fileUrl && !fileType?.startsWith('image/') && !fileType?.startsWith('audio/') && !fileType?.startsWith('video/') && !fileType?.startsWith('code/') && fileType !== 'text/markdown' && fileType !== 'text/csv' && fileType !== 'text/plain' && fileType !== 'application/word' && fileType !== 'application/pdf' && (
                                    <Box sx={{ p: 4, textAlign: 'center' }}>
                                        <Typography sx={{ mb: 2, color: '#9E9E8E' }}>Preview not available for: {fileType || 'Unknown'}</Typography>
                                        <DownloadBtn label="Download File" />
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </Modal>
    )
}

const TransactionList = () => {
    const [walletAddress, setWalletAddress] = useState(null)
    const [rows, setRows] = useState([])
    const [filteredRows, setFilteredRows] = useState([])
    const [open, setOpen] = useState(false)
    const [fileUrl, setFileUrl] = useState(null)
    const [fileType, setFileType] = useState(null)
    const [selectedFileName, setSelectedFileName] = useState("")
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState('all')
    const [copiedHash, setCopiedHash] = useState(null)
    const navigate = useNavigate()
    const { walletAddress: paramWalletAddress } = useParams()

    useEffect(() => {
        const fetchWalletAddress = async () => {
            if (paramWalletAddress) {
                setWalletAddress(paramWalletAddress)
            } else if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
                    if (accounts.length > 0) setWalletAddress(accounts[0])
                } catch (e) { console.error(e) }
            }
        }
        fetchWalletAddress()
    }, [paramWalletAddress])

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!walletAddress) return
            setLoading(true)
            try {
                const response = await axios.get(`${API_URL}/api/v1/files/all-hashes`, { params: { user_address: walletAddress } })
                const data = response.data.file_hashes
                const formatted = Object.entries(data).map(([fileName, fileData], index) => ({
                    id: index + 1,
                    fileName,
                    fileHash: fileData.hash,
                    timestamp: fileData.time_stamp ? new Date(fileData.time_stamp * 1000).toLocaleString() : 'No date',
                }))
                setRows(formatted)
                setFilteredRows(formatted)
            } catch (e) { console.error(e) }
            finally { setLoading(false) }
        }
        fetchTransactions()
    }, [walletAddress])

    useEffect(() => {
        let result = rows
        if (searchTerm) result = result.filter(r => r.fileName.toLowerCase().includes(searchTerm.toLowerCase()))
        if (activeTab === 'images') result = result.filter(r => ['jpg','jpeg','png','gif','svg','webp'].includes(r.fileName.split('.').pop()?.toLowerCase()))
        if (activeTab === 'docs') result = result.filter(r => ['pdf','txt','doc','docx','md','csv'].includes(r.fileName.split('.').pop()?.toLowerCase()))
        setFilteredRows(result)
    }, [searchTerm, rows, activeTab])

    const handlePreview = async (ipfsHash, fileName) => {
        setSelectedFileName(fileName)
        const ipfsUrl = `${process.env.REACT_APP_IPFS_BASE_URL}${ipfsHash}`
        try {
            const res = await axios.head(ipfsUrl)
            setFileType(res.headers["content-type"])
        } catch {
            setFileType(getFileTypeFromName(fileName))
        }
        setFileUrl(ipfsUrl)
        setOpen(true)
    }

    const handleClose = () => { setOpen(false); setFileUrl(null); setFileType(null) }

    const copyHash = (hash) => {
        navigator.clipboard.writeText(hash)
        setCopiedHash(hash)
        setTimeout(() => setCopiedHash(null), 2000)
    }

    const formatAddr = (addr) => !addr || addr.length < 10 ? addr || '' : `${addr.slice(0, 6)}...${addr.slice(-4)}`

    const tabs = [
        { key: 'all', label: 'All Files', count: rows.length },
        { key: 'images', label: 'Images', count: rows.filter(r => ['jpg','jpeg','png','gif','svg','webp'].includes(r.fileName.split('.').pop()?.toLowerCase())).length },
        { key: 'docs', label: 'Documents', count: rows.filter(r => ['pdf','txt','doc','docx','md','csv'].includes(r.fileName.split('.').pop()?.toLowerCase())).length },
    ]

    const columns = [
        {
            field: 'id',
            headerName: '#',
            width: 60,
            renderCell: (params) => (
                <Typography sx={{ fontSize: '0.75rem', color: '#555', fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 }}>
                    {String(params.value).padStart(2, '0')}
                </Typography>
            ),
        },
        {
            field: "fileName",
            headerName: "File",
            flex: 1,
            minWidth: 220,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, height: '100%' }}>
                    <Box sx={{ width: 34, height: 34, borderRadius: '8px', background: '#1A1A1A', border: '1px solid #2E2E2E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {getFileTypeIcon(params.value)}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography sx={{ fontSize: '0.83rem', color: '#F5F0E8', fontWeight: 500, lineHeight: 1.3 }}>{params.value}</Typography>
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.4, mt: 0.4 }}>
                            <VerifiedIcon sx={{ fontSize: '0.6rem', color: '#4CAF7D' }} />
                            <Typography sx={{ fontSize: '0.6rem', color: '#4CAF7D', letterSpacing: '0.06em' }}>VERIFIED</Typography>
                        </Box>
                    </Box>
                </Box>
            ),
        },
        {
            field: "timestamp",
            headerName: "Stamped",
            width: 170,
            renderCell: (params) => (
                <Typography sx={{ fontSize: '0.78rem', color: '#9E9E8E' }}>{params.value}</Typography>
            ),
        },
        {
            field: "fileHash",
            headerName: "IPFS Hash",
            width: 140,
            renderCell: (params) => (
                <Tooltip title={params.value}>
                    <Typography sx={{ fontSize: '0.75rem', color: 'rgba(201,168,76,0.8)', fontFamily: '"JetBrains Mono", monospace', cursor: 'default' }}>
                        {formatAddr(params.value)}
                    </Typography>
                </Tooltip>
            ),
        },
        {
            field: "actions",
            headerName: "",
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Preview">
                        <IconButton size="small" onClick={() => handlePreview(params.row.fileHash, params.row.fileName)}
                            sx={{ color: '#555', '&:hover': { color: '#C9A84C', background: 'rgba(201,168,76,0.08)' }, borderRadius: '8px', p: 0.8 }}>
                            <VisibilityIcon sx={{ fontSize: '1rem' }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={copiedHash === params.row.fileHash ? "Copied!" : "Copy Hash"}>
                        <IconButton size="small" onClick={() => copyHash(params.row.fileHash)}
                            sx={{ color: copiedHash === params.row.fileHash ? '#4CAF7D' : '#555', '&:hover': { color: '#C9A84C', background: 'rgba(201,168,76,0.08)' }, borderRadius: '8px', p: 0.8 }}>
                            {copiedHash === params.row.fileHash ? <CheckIcon sx={{ fontSize: '1rem' }} /> : <ContentCopyIcon sx={{ fontSize: '1rem' }} />}
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ]

    return (
        <Box sx={{ bgcolor: "#1A1A1A", minHeight: "100vh", display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            {/* Hero */}
            <Box sx={{
                py: { xs: 10, md: 14 },
                background: 'radial-gradient(ellipse at 50% 0%, rgba(42,32,16,0.8) 0%, #1A1A1A 60%)',
                position: 'relative', overflow: 'hidden', textAlign: 'center',
                '@keyframes shimmer': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
            }}>
                <Box sx={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 600, height: 250, background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <Chip label="⬡ Public Ledger" size="small" sx={{ mb: 3, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: '#C9A84C', fontSize: '0.7rem', letterSpacing: '0.05em' }} />
                        <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, fontWeight: 700, mb: 2, letterSpacing: '-0.02em' }}>
                            Verified{' '}
                            <Box component="span" sx={{ background: 'linear-gradient(135deg, #C9A84C, #E8B94F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                Records
                            </Box>
                        </Typography>
                        <Typography sx={{ color: '#9E9E8E', fontSize: '1rem', maxWidth: 480, mx: 'auto', lineHeight: 1.8, mb: 3 }}>
                            Every entry below is immutably anchored on the Ethereum blockchain. Verifiable by anyone, forever.
                        </Typography>
                        {walletAddress && (
                            <Chip
                                icon={<WalletIcon sx={{ fontSize: '0.85rem !important', color: '#C9A84C !important' }} />}
                                label={`${formatAddr(walletAddress)}`}
                                onClick={() => copyHash(walletAddress)}
                                sx={{
                                    background: 'rgba(201,168,76,0.08)',
                                    border: '1px solid transparent',
                                    backgroundImage: 'linear-gradient(rgba(201,168,76,0.08), rgba(201,168,76,0.08)), linear-gradient(90deg, rgba(201,168,76,0.6), rgba(232,185,79,0.9), rgba(201,168,76,0.6))',
                                    backgroundOrigin: 'border-box',
                                    backgroundClip: 'padding-box, border-box',
                                    backgroundSize: '200% 200%',
                                    animation: 'shimmer 2s infinite',
                                    color: '#C9A84C',
                                    fontFamily: '"JetBrains Mono", monospace',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                }}
                            />
                        )}
                        <Typography sx={{ color: '#555', fontSize: '0.75rem', mt: 2, letterSpacing: '0.1em' }}>
                            {rows.length} FILES STAMPED
                        </Typography>
                    </motion.div>
                </Container>
            </Box>

            {/* Table section */}
            <Container maxWidth="lg" sx={{ flex: 1, py: { xs: 4, md: 6 }, pb: 14 }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    <Box sx={{ background: '#242424', border: '1px solid #2E2E2E', borderRadius: '20px', overflow: 'hidden', position: 'relative' }}>
                        <LedgerWatermark />

                        {/* Toolbar */}
                        <Box sx={{ p: 3, borderBottom: '1px solid #2A2A2A', display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            {/* Tabs */}
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {tabs.map(t => (
                                    <Box
                                        key={t.key}
                                        onClick={() => setActiveTab(t.key)}
                                        sx={{
                                            px: 2.5, py: 0.8, borderRadius: '20px', cursor: 'pointer',
                                            background: activeTab === t.key ? 'rgba(201,168,76,0.1)' : 'transparent',
                                            border: `1px solid ${activeTab === t.key ? 'rgba(201,168,76,0.25)' : 'transparent'}`,
                                            transition: 'all 0.2s',
                                            display: 'flex', alignItems: 'center', gap: 1,
                                        }}
                                    >
                                        <Typography sx={{ fontSize: '0.78rem', color: activeTab === t.key ? '#C9A84C' : '#555', fontWeight: activeTab === t.key ? 600 : 400 }}>
                                            {t.label}
                                        </Typography>
                                        <Box sx={{ background: activeTab === t.key ? 'rgba(201,168,76,0.15)' : '#2E2E2E', px: 0.8, py: 0.1, borderRadius: '10px' }}>
                                            <Typography sx={{ fontSize: '0.65rem', color: activeTab === t.key ? '#C9A84C' : '#444' }}>{t.count}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>

                            {/* Right side: record count + search */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography sx={{ fontSize: '0.72rem', color: '#444', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                                    {filteredRows.length} records
                                </Typography>

                                {/* Search */}
                                <TextField
                                    placeholder="Search files..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    size="small"
                                    sx={{
                                        width: 240,
                                        '& .MuiOutlinedInput-root': {
                                            background: '#1A1A1A', color: '#F5F0E8', borderRadius: '10px', fontSize: '0.82rem',
                                            '& fieldset': { borderColor: '#333' },
                                            '&:hover fieldset': { borderColor: 'rgba(201,168,76,0.35)' },
                                            '&.Mui-focused fieldset': { borderColor: '#C9A84C' },
                                        },
                                        '& .MuiInputLabel-root': { color: '#555' },
                                    }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#555', fontSize: '1rem' }} /></InputAdornment>,
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Data grid */}
                        <Box sx={{ height: 520, bgcolor: '#1A1A1A' }}>
                            {loading ? (
                                <Box sx={{ p: 3 }}>
                                    {[...Array(6)].map((_, i) => (
                                        <Skeleton key={i} variant="rectangular" height={52} sx={{ mb: 1, bgcolor: '#242424', borderRadius: '8px' }} />
                                    ))}
                                </Box>
                            ) : (
                                <StyledDataGrid
                                    rows={filteredRows}
                                    columns={columns}
                                    pageSize={8}
                                    rowsPerPageOptions={[8, 16, 32]}
                                    disableSelectionOnClick
                                    disableColumnMenu
                                    rowHeight={64}
                                    sx={{ border: 'none' }}
                                />
                            )}
                        </Box>
                    </Box>
                </motion.div>

                {/* Bottom nav */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Button startIcon={<ArrowBackIcon sx={{ fontSize: '0.9rem' }} />} onClick={() => navigate(-1)}
                        sx={{ color: '#555', fontSize: '0.78rem', '&:hover': { color: '#C9A84C', background: 'transparent' } }}>
                        Back
                    </Button>
                    <Button variant="outlined" onClick={() => navigate('/upload')}
                        sx={{ borderColor: 'rgba(201,168,76,0.3)', color: '#C9A84C', borderRadius: '10px', fontSize: '0.78rem', '&:hover': { borderColor: '#C9A84C', background: 'rgba(201,168,76,0.05)' } }}>
                        Stamp a New File
                    </Button>
                </Box>
            </Container>

            <FilePreviewModal open={open} onClose={handleClose} fileUrl={fileUrl} fileType={fileType} fileName={selectedFileName} />
            <Footer />
        </Box>
    )
}

export default TransactionList
