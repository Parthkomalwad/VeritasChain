import React, { useState, useEffect, useRef } from "react"
import axios from "axios"
import {
    Box,
    Typography,
    Button,
    TextField,
    Paper,
    Alert,
    Container,
    styled,
    alpha,
    Chip,
    Grow,
    Divider,
    IconButton,
    Tooltip,
    Stack,
    LinearProgress,
} from "@mui/material"
import {
    ShieldOutlined,
    StorageOutlined,
    LockOutlined,
    UploadFileOutlined,
    InsertDriveFileOutlined,
    AccountBalanceWalletOutlined,
    ContentCopyOutlined,
    CheckCircleOutlined,
    ErrorOutlineOutlined,
    InfoOutlined,
    ArrowBackOutlined,
} from "@mui/icons-material"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import Navbar from "../Micro-Components/Navbar"
import Footer from "../Micro-Components/Footer"

// ── Styled components ──────────────────────────────────────────────────────────
const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
})

const StyledPaper = styled(Paper)(({ theme }) => ({
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#242424",
    border: "1px solid #2E2E2E",
    color: "#F5F0E8",
    borderRadius: "20px",
}))

const GlowingBorder = styled(Box)(({ theme }) => ({
    position: "relative",
    "&::after": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: theme.shape.borderRadius,
        padding: 2,
        background: `linear-gradient(60deg, #C9A84C, #a8893e)`,
        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        maskComposite: "exclude",
        pointerEvents: "none",
    },
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
        backgroundColor: "#1A1A1A",
        color: "#F5F0E8",
        "& fieldset": {
            borderColor: "#2E2E2E",
        },
        "&:hover fieldset": {
            borderColor: "#C9A84C",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#C9A84C",
        },
    },
    "& .MuiInputLabel-root": {
        color: "#9E9E8E",
    },
    "& .MuiInputLabel-root.Mui-focused": {
        color: "#C9A84C",
    },
    "& .MuiInputAdornment-root": {
        color: "#9E9E8E",
    },
}))

// ── Component ──────────────────────────────────────────────────────────────────
const BlockchainFileUploader = ({
    onUploadSuccess,
    onUploadError,
    apiEndpoint = `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/api/v1/files/upload`,
}) => {
    const navigate = useNavigate()
    const [file, setFile] = useState(null)
    const [fileName, setFileName] = useState("")
    const [userAddress, setUserAddress] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const [uploadStatus, setUploadStatus] = useState("idle")
    const [dragActive, setDragActive] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [copied, setCopied] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const fileInputRef = useRef(null)

    useEffect(() => {
        console.log("Checking for MetaMask...")
        const fetchWalletAddress = async () => {
            console.log("Checking for MetaMask...")
            if (window.ethereum) {
                try {
                    console.log("Requesting accounts...")
                    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
                    console.log("Accounts received:", accounts)
                    if (accounts.length > 0) {
                        console.log("Wallet address:", accounts[0])
                        setUserAddress(accounts[0])
                    } else {
                        console.warn("No accounts found.")
                    }
                } catch (error) {
                    console.error("Error fetching wallet address:", error)
                }
            } else {
                console.warn("MetaMask is not installed.")
            }
        }

        fetchWalletAddress()
    }, [])

    // Simulate upload progress
    useEffect(() => {
        if (isUploading) {
            const interval = setInterval(() => {
                setUploadProgress((prev) => {
                    const newProgress = prev + Math.random() * 10
                    return newProgress >= 100 ? 100 : newProgress
                })
            }, 300)

            return () => clearInterval(interval)
        } else {
            setUploadProgress(0)
        }
    }, [isUploading])

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            setFile(selectedFile)
            if (!fileName) {
                setFileName(selectedFile.name.split(".")[0])
            }
        }
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0]
            setFile(droppedFile)
            if (!fileName) {
                setFileName(droppedFile.name.split(".")[0])
            }
        }
    }

    const handleDropAreaClick = () => {
        fileInputRef.current?.click()
    }

    const handleUpload = async () => {
        if (!file || !fileName || !userAddress) {
            alert("Please fill all fields and select a file.")
            return
        }

        setIsUploading(true)
        setUploadStatus("idle")

        try {
            setCurrentStep(1)
            const formData = new FormData()
            formData.append("file", file)
            formData.append("file_name", fileName)
            formData.append("user_address", userAddress)

            // Debugging: Log FormData
            console.log("File:", file)
            console.log("File Name:", fileName)
            console.log("User Address:", userAddress)
            formData.forEach((value, key) => {
                console.log(key, value)
            })

            const response = await axios.post(apiEndpoint, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            console.log("File uploaded:", response.data)
            setUploadStatus("success")
            setCurrentStep(2)
            setTimeout(() => setCurrentStep(3), 500)
            if (onUploadSuccess) onUploadSuccess(response.data)
        } catch (error) {
            console.error("Error uploading file:", error)
            setUploadStatus("error")
            setCurrentStep(0)
            if (onUploadError) onUploadError(error)
        } finally {
            setIsUploading(false)
        }
    }

    const formatAddress = (address) => {
        if (address.length < 10) return address
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(userAddress)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const getFileIcon = () => {
        if (!file) return null

        if (file.type.startsWith("image/")) {
            return (
                <Box
                    component="img"
                    src={URL.createObjectURL(file)}
                    alt="File preview"
                    sx={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 1,
                        boxShadow: 2,
                    }}
                />
            )
        }

        return <InsertDriveFileOutlined sx={{ fontSize: "3.75rem", color: "#C9A84C" }} />
    }

    return (
        <Box sx={{ bgcolor: "#1A1A1A", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar />

            {/* ── Hero section ────────────────────────────────────────────── */}
            <Box
                sx={{
                    position: "relative",
                    pt: { xs: 10, md: 14 },
                    pb: { xs: 8, md: 10 },
                    textAlign: "center",
                    overflow: "hidden",
                    background:
                        "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(201,168,76,0.12) 0%, transparent 70%), #1A1A1A",
                    "@keyframes floatA": {
                        "0%, 100%": { transform: "translate(0, 0) scale(1)" },
                        "33%": { transform: "translate(20px, -30px) scale(1.08)" },
                        "66%": { transform: "translate(-15px, 15px) scale(0.95)" },
                    },
                    "@keyframes floatB": {
                        "0%, 100%": { transform: "translate(0, 0) scale(1)" },
                        "50%": { transform: "translate(-25px, -20px) scale(1.1)" },
                    },
                    "@keyframes floatC": {
                        "0%, 100%": { transform: "translate(0, 0)" },
                        "40%": { transform: "translate(18px, 22px)" },
                        "80%": { transform: "translate(-10px, -15px)" },
                    },
                }}
            >
                {/* Grid overlay */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage:
                            "linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                        pointerEvents: "none",
                    }}
                />

                {/* Floating orb 1 */}
                <Box sx={{
                    position: "absolute", top: "15%", left: "10%",
                    width: 220, height: 220,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)",
                    pointerEvents: "none",
                    animation: "floatA 9s ease-in-out infinite",
                }} />
                {/* Floating orb 2 */}
                <Box sx={{
                    position: "absolute", top: "5%", right: "12%",
                    width: 160, height: 160,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
                    pointerEvents: "none",
                    animation: "floatB 12s ease-in-out infinite",
                }} />
                {/* Floating orb 3 */}
                <Box sx={{
                    position: "absolute", bottom: "10%", left: "30%",
                    width: 100, height: 100,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)",
                    pointerEvents: "none",
                    animation: "floatC 7s ease-in-out infinite",
                }} />
                {/* Floating orb 4 - small accent */}
                <Box sx={{
                    position: "absolute", top: "40%", right: "6%",
                    width: 60, height: 60,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)",
                    pointerEvents: "none",
                    animation: "floatA 6s ease-in-out infinite 2s",
                }} />

                <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
                    <Typography
                        variant="overline"
                        sx={{ color: "#C9A84C", letterSpacing: "0.35em", fontSize: "0.7rem", display: "block", mb: 2 }}
                    >
                        STAMP A FILE
                    </Typography>
                    <Typography
                        component="h1"
                        sx={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: { xs: "2.2rem", md: "3rem" },
                            fontWeight: 700,
                            color: "#F5F0E8",
                            mb: 2,
                            lineHeight: 1.2,
                        }}
                    >
                        Anchor Your Content
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#9E9E8E", fontSize: "1rem", lineHeight: 1.8 }}>
                        Upload. Sign. Anchor. Done. Your file's authenticity, sealed forever on the blockchain.
                    </Typography>
                </Container>
            </Box>

            {/* ── Main card ───────────────────────────────────────────────── */}
            <Container maxWidth="md" sx={{ flex: 1, pb: 8 }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <StyledPaper elevation={6} sx={{ p: { xs: 3, md: 4 } }}>
                        {/* Back button */}
                        <Box sx={{ position: "absolute", top: 16, left: 16, zIndex: 1 }}>
                            <Tooltip title="Back">
                                <IconButton
                                    onClick={() => (navigate ? navigate(-1) : window.history.back())}
                                    sx={{ color: "#ffffff", "&:hover": { bgcolor: alpha("#ffffff", 0.1) } }}
                                >
                                    <ArrowBackOutlined />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        {/* Transactions button */}
                        <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 1 }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate("/public-transactions")}
                                size="small"
                                sx={{
                                    color: "#9E9E8E",
                                    borderColor: "#2E2E2E",
                                    borderRadius: "10px",
                                    fontSize: "0.75rem",
                                    px: 2,
                                    py: 0.8,
                                    letterSpacing: "0.04em",
                                    "&:hover": {
                                        color: "#C9A84C",
                                        borderColor: "rgba(201,168,76,0.4)",
                                        backgroundColor: "rgba(201,168,76,0.05)",
                                    },
                                }}
                            >
                                View Transactions
                            </Button>
                        </Box>

                        {/* Step progress indicator */}
                        {(() => {
                            const uploadSteps = ["Upload", "Sign", "Anchor", "Done"]
                            return (
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        pt: 6,
                                        pb: 4,
                                        position: "relative",
                                        zIndex: 1,
                                    }}
                                >
                                    {uploadSteps.map((step, i) => (
                                        <React.Fragment key={step}>
                                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                <Box
                                                    sx={{
                                                        width: 36,
                                                        height: 36,
                                                        borderRadius: "50%",
                                                        background:
                                                            i <= currentStep
                                                                ? "linear-gradient(135deg, #C9A84C, #E8B94F)"
                                                                : "#2E2E2E",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        transition: "all 0.4s",
                                                        boxShadow:
                                                            i <= currentStep
                                                                ? "0 0 12px rgba(201,168,76,0.4)"
                                                                : "none",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: i <= currentStep ? "#1A1A1A" : "#9E9E8E",
                                                            fontWeight: 700,
                                                            fontSize: "0.75rem",
                                                        }}
                                                    >
                                                        {i < currentStep ? "✓" : i + 1}
                                                    </Typography>
                                                </Box>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: i <= currentStep ? "#C9A84C" : "#9E9E8E",
                                                        mt: 0.75,
                                                        fontSize: "0.65rem",
                                                        letterSpacing: "0.05em",
                                                    }}
                                                >
                                                    {step}
                                                </Typography>
                                            </Box>
                                            {i < uploadSteps.length - 1 && (
                                                <Box
                                                    sx={{
                                                        width: 80,
                                                        height: 1,
                                                        background:
                                                            i < currentStep ? "#C9A84C" : "#2E2E2E",
                                                        transition: "all 0.4s",
                                                        mb: 2.5,
                                                        mx: 0.5,
                                                    }}
                                                />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </Box>
                            )
                        })()}

                        {/* Drop area */}
                        <Box
                            sx={{
                                border: "2px dashed",
                                borderColor: dragActive ? "#C9A84C" : "#2E2E2E",
                                borderRadius: "16px",
                                p: 5,
                                textAlign: "center",
                                cursor: "pointer",
                                transition: "all 0.3s",
                                position: "relative",
                                mb: 4,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                minHeight: 220,
                                background: dragActive ? "rgba(201,168,76,0.04)" : "transparent",
                                ...(!file && !dragActive && {
                                    "@keyframes pulse": {
                                        "0%, 100%": {
                                            boxShadow: "0 0 0px rgba(201,168,76,0)",
                                        },
                                        "50%": {
                                            boxShadow: "0 0 20px rgba(201,168,76,0.18), 0 0 40px rgba(201,168,76,0.07)",
                                        },
                                    },
                                    animation: "pulse 3s ease-in-out infinite",
                                }),
                                "&:hover": {
                                    borderColor: "#C9A84C",
                                    background: "rgba(201,168,76,0.04)",
                                    boxShadow: "0 0 30px rgba(201,168,76,0.08)",
                                    animation: "none",
                                },
                            }}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={handleDropAreaClick}
                        >
                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: 8,
                                    right: 12,
                                    fontFamily: '"JetBrains Mono", monospace',
                                    fontSize: "8px",
                                    opacity: 0.05,
                                    color: "#C9A84C",
                                    letterSpacing: "4px",
                                    userSelect: "text",
                                    pointerEvents: "none",
                                }}
                            >
                                .... /
                            </Box>

                            <Box
                                sx={{
                                    textAlign: "center",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {file ? (
                                    <Grow in timeout={500}>
                                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            {getFileIcon()}
                                            <Typography
                                                variant="h6"
                                                sx={{ mt: 2, fontWeight: 600, color: "#F5F0E8" }}
                                            >
                                                {file.name}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ mt: 1, color: "#9E9E8E" }}
                                            >
                                                {(file.size / 1024).toFixed(2)} KB &bull; {file.type || "Unknown type"}
                                            </Typography>
                                            <Button
                                                size="small"
                                                sx={{ mt: 2, color: "#C9A84C" }}
                                                startIcon={<UploadFileOutlined sx={{ fontSize: "1rem" }} />}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    fileInputRef.current?.click()
                                                }}
                                            >
                                                Change File
                                            </Button>
                                        </Box>
                                    </Grow>
                                ) : (
                                    <>
                                        <UploadFileOutlined
                                            sx={{
                                                fontSize: "3rem",
                                                color: "#C9A84C",
                                                opacity: 0.85,
                                                mb: 2,
                                            }}
                                        />
                                        <Typography
                                            variant="h6"
                                            gutterBottom
                                            sx={{ color: "#F5F0E8", fontWeight: 600 }}
                                        >
                                            Drag &amp; drop your file here
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            gutterBottom
                                            sx={{ color: "#9E9E8E" }}
                                        >
                                            or click to browse your files
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<UploadFileOutlined sx={{ fontSize: "1rem" }} />}
                                            sx={{
                                                mt: 2,
                                                borderColor: alpha("#C9A84C", 0.5),
                                                color: "#C9A84C",
                                                "&:hover": {
                                                    borderColor: "#C9A84C",
                                                    bgcolor: alpha("#C9A84C", 0.1),
                                                },
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                fileInputRef.current?.click()
                                            }}
                                        >
                                            Select File
                                        </Button>
                                    </>
                                )}
                                <VisuallyHiddenInput
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                            </Box>
                        </Box>

                        {/* Form fields */}
                        <Stack spacing={3} sx={{ mb: 4, position: "relative", zIndex: 1 }}>
                            <StyledTextField
                                fullWidth
                                label="File Name"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InsertDriveFileOutlined
                                            sx={{ fontSize: "1.25rem", mr: 1, color: "#9E9E8E" }}
                                        />
                                    ),
                                }}
                            />

                            <Box sx={{ position: "relative" }}>
                                <StyledTextField
                                    fullWidth
                                    label="Wallet Address"
                                    value={userAddress}
                                    onChange={(e) => setUserAddress(e.target.value)}
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <AccountBalanceWalletOutlined
                                                sx={{ fontSize: "1.25rem", mr: 1, color: "#9E9E8E" }}
                                            />
                                        ),
                                        endAdornment: userAddress && (
                                            <Tooltip title={copied ? "Copied!" : "Copy address"}>
                                                <IconButton
                                                    edge="end"
                                                    onClick={copyToClipboard}
                                                    size="small"
                                                    sx={{ color: copied ? "#10b981" : "#C9A84C" }}
                                                >
                                                    {copied ? (
                                                        <CheckCircleOutlined sx={{ fontSize: "1.25rem" }} />
                                                    ) : (
                                                        <ContentCopyOutlined sx={{ fontSize: "1.25rem" }} />
                                                    )}
                                                </IconButton>
                                            </Tooltip>
                                        ),
                                    }}
                                />
                                {userAddress && (
                                    <Chip
                                        label={`Connected: ${formatAddress(userAddress)}`}
                                        size="small"
                                        sx={{
                                            position: "absolute",
                                            top: -10,
                                            right: 8,
                                            bgcolor: alpha("#10b981", 0.2),
                                            color: "#10b981",
                                            borderColor: alpha("#10b981", 0.3),
                                        }}
                                        icon={
                                            <CheckCircleOutlined
                                                sx={{ fontSize: "0.875rem !important", color: "#10b981 !important" }}
                                            />
                                        }
                                        variant="outlined"
                                    />
                                )}
                            </Box>
                        </Stack>

                        {/* Upload button */}
                        <GlowingBorder sx={{ mb: 3, position: "relative", zIndex: 1 }}>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleUpload}
                                disabled={isUploading || !file || !fileName || !userAddress}
                                startIcon={
                                    isUploading ? undefined : (
                                        <StorageOutlined sx={{ fontSize: "1.25rem" }} />
                                    )
                                }
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    position: "relative",
                                    overflow: "hidden",
                                    background: "linear-gradient(45deg, #a8893e, #C9A84C)",
                                    color: "#1A1A1A",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-2px)",
                                        boxShadow: `0 8px 20px -4px ${alpha("#C9A84C", 0.4)}`,
                                    },
                                    "&.Mui-disabled": {
                                        background: alpha("#C9A84C", 0.3),
                                    },
                                }}
                            >
                                {isUploading ? (
                                    <Box
                                        sx={{
                                            width: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography variant="button" sx={{ mb: 1 }}>
                                            {uploadProgress < 100
                                                ? "Uploading to IPFS..."
                                                : "Confirming on Blockchain..."}
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={uploadProgress}
                                            sx={{
                                                width: "80%",
                                                height: 6,
                                                borderRadius: 3,
                                                bgcolor: alpha("#ffffff", 0.2),
                                                "& .MuiLinearProgress-bar": {
                                                    bgcolor: "#ffffff",
                                                },
                                            }}
                                        />
                                    </Box>
                                ) : (
                                    <Typography sx={{ color: "#1A1A1A" }}>
                                        Upload to Blockchain
                                    </Typography>
                                )}
                            </Button>
                        </GlowingBorder>

                        {/* Status alerts */}
                        {uploadStatus === "success" && (
                            <Grow in timeout={500}>
                                <Alert
                                    icon={<CheckCircleOutlined sx={{ fontSize: "1.25rem" }} />}
                                    severity="success"
                                    variant="filled"
                                    sx={{ mb: 3, borderRadius: 2, bgcolor: "#059669" }}
                                >
                                    File successfully uploaded to the blockchain!
                                </Alert>
                            </Grow>
                        )}

                        {uploadStatus === "error" && (
                            <Grow in timeout={500}>
                                <Alert
                                    icon={<ErrorOutlineOutlined sx={{ fontSize: "1.25rem" }} />}
                                    severity="error"
                                    variant="filled"
                                    sx={{ mb: 3, borderRadius: 2 }}
                                >
                                    Error uploading file. Please try again.
                                </Alert>
                            </Grow>
                        )}

                        {/* Divider + info row */}
                        <Divider sx={{ my: 3, bgcolor: "#2E2E2E" }} />

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 1,
                                position: "relative",
                                zIndex: 1,
                                mb: 3,
                            }}
                        >
                            <InfoOutlined sx={{ fontSize: "1rem", color: alpha("#ffffff", 0.7) }} />
                            <Typography
                                variant="body2"
                                sx={{ color: alpha("#ffffff", 0.7) }}
                                align="center"
                            >
                                Your files are securely stored on IPFS and referenced on the blockchain
                            </Typography>
                        </Box>

                        {/* Security info row */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: 2,
                                position: "relative",
                                zIndex: 1,
                            }}
                        >
                            {[
                                { Icon: ShieldOutlined, label: "Secure" },
                                { Icon: StorageOutlined, label: "Decentralized" },
                                { Icon: LockOutlined, label: "Tamper-proof" },
                            ].map(({ Icon, label }) => (
                                <Box
                                    key={label}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 0.75,
                                        p: 2,
                                        borderRadius: "12px",
                                        border: "1px solid #2E2E2E",
                                        borderTop: "2px solid rgba(201,168,76,0.15)",
                                        bgcolor: "#1A1A1A",
                                        transition: "transform 0.2s ease",
                                        "&:hover": {
                                            transform: "translateY(-2px)",
                                        },
                                    }}
                                >
                                    <Icon sx={{ fontSize: "1.25rem", color: alpha("#C9A84C", 0.8) }} />
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: alpha("#C9A84C", 0.8),
                                            fontSize: "0.7rem",
                                            letterSpacing: "0.05em",
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        {label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </StyledPaper>
                </motion.div>
            </Container>

            <Footer />
        </Box>
    )
}

export default BlockchainFileUploader
