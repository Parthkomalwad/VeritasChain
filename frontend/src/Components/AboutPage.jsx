import React, { useRef } from "react"
import { Box, Typography, Container, Paper } from "@mui/material"
import {
    PrivacyTipOutlined,
    LinkOutlined,
    CodeOutlined,
    AllInclusiveOutlined,
} from "@mui/icons-material"
import { motion, useInView } from "framer-motion"
import Navbar from "../Micro-Components/Navbar"
import Footer from "../Micro-Components/Footer"

// ── Animation helpers ──────────────────────────────────────────────────────────
const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
    }),
}

function AnimatedSection({ children, delay = 0, style = {} }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: "-80px" })
    return (
        <motion.div
            ref={ref}
            custom={delay}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            style={style}
        >
            {children}
        </motion.div>
    )
}

// ── Value cards data ───────────────────────────────────────────────────────────
const VALUES = [
    {
        Icon: PrivacyTipOutlined,
        title: "Privacy First",
        body: "We never store your files  only cryptographic fingerprints. Your content stays yours, always.",
    },
    {
        Icon: LinkOutlined,
        title: "Immutable Proof",
        body: "Once anchored to the chain, a record cannot be altered, deleted, or disputed. Truth, petrified.",
    },
    {
        Icon: CodeOutlined,
        title: "Radically Open Source",
        body: "Every line of code is public. Audit it, fork it, build on it. Transparency is not optional.",
    },
    {
        Icon: AllInclusiveOutlined,
        title: "Knowledge is Free",
        body: "No paywalls. No gatekeepers. No accounts required. The tools of truth belong to everyone.",
    },
]

// ── Component ──────────────────────────────────────────────────────────────────
export default function AboutPage() {
    const valuesRef = useRef(null)
    const valuesInView = useInView(valuesRef, { once: true, margin: "-60px" })

    return (
        <Box
            sx={{
                bgcolor: "#1A1A1A",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                fontFamily: "'Inter', sans-serif",
                color: "#F5F0E8",
            }}
        >
            <Navbar />

            {/* ── Hero ──────────────────────────────────────────────────────── */}
            <Box
                sx={{
                    position: "relative",
                    pt: { xs: 14, md: 20 },
                    pb: { xs: 12, md: 18 },
                    textAlign: "center",
                    overflow: "hidden",
                    background:
                        "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.13) 0%, transparent 70%), #1A1A1A",
                }}
            >
                {/* Subtle grid lines */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage:
                            "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                        pointerEvents: "none",
                    }}
                />

                <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
                    <AnimatedSection delay={0}>
                        <Typography
                            variant="overline"
                            sx={{
                                color: "#C9A84C",
                                letterSpacing: "0.35em",
                                fontSize: "0.7rem",
                                display: "block",
                                mb: 3,
                            }}
                        >
                            ABOUT VERITASCHAIN
                        </Typography>
                    </AnimatedSection>

                    <AnimatedSection delay={1}>
                        <Typography
                            component="h1"
                            sx={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: { xs: "2.8rem", sm: "4rem", md: "5.5rem" },
                                fontWeight: 700,
                                lineHeight: 1.1,
                                mb: 3,
                                color: "#F5F0E8",
                            }}
                        >
                            Built by No One.
                            <br />
                            <Box
                                component="span"
                                sx={{
                                    background:
                                        "linear-gradient(90deg, #C9A84C 0%, #E8B94F 50%, #C9A84C 100%)",
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                For Everyone.
                            </Box>
                        </Typography>
                    </AnimatedSection>

                    <AnimatedSection delay={2}>
                        <Typography
                            variant="body1"
                            sx={{
                                color: "#9E9E8E",
                                maxWidth: 560,
                                mx: "auto",
                                fontSize: "1.1rem",
                                lineHeight: 1.8,
                            }}
                        >
                            VeritasChain was created anonymously, by no one in particular and everyone
                            in principle. The belief is simple: knowledge should be free, and the tools
                            to verify it should be available to all.
                        </Typography>
                    </AnimatedSection>
                </Container>
            </Box>

            {/* ── Manifesto quote ───────────────────────────────────────────── */}
            <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: "#1A1A1A" }}>
                <Container maxWidth="md">
                    <AnimatedSection delay={0}>
                        <Box
                            sx={{
                                borderLeft: "3px solid #C9A84C",
                                pl: { xs: 3, md: 5 },
                                py: 2,
                                mx: "auto",
                                maxWidth: 780,
                            }}
                        >
                            <Typography
                                component="blockquote"
                                sx={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontStyle: "italic",
                                    fontSize: { xs: "1.4rem", md: "1.9rem" },
                                    lineHeight: 1.6,
                                    color: "#F5F0E8",
                                    m: 0,
                                }}
                            >
                                "In a world where reality is manufactured, the only currency worth having
                                is verifiable truth."
                            </Typography>
                        </Box>
                    </AnimatedSection>
                </Container>
            </Box>

            {/* ── Values ────────────────────────────────────────────────────── */}
            <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: "#111111" }}>
                <Container maxWidth="lg">
                    <AnimatedSection delay={0}>
                        <Typography
                            variant="overline"
                            sx={{
                                color: "#C9A84C",
                                letterSpacing: "0.35em",
                                fontSize: "0.7rem",
                                display: "block",
                                textAlign: "center",
                                mb: 1,
                            }}
                        >
                            PRINCIPLES
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: { xs: "2rem", md: "2.8rem" },
                                fontWeight: 700,
                                textAlign: "center",
                                mb: 8,
                                color: "#F5F0E8",
                            }}
                        >
                            What We Stand For
                        </Typography>
                    </AnimatedSection>

                    <Box
                        ref={valuesRef}
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" },
                            gap: 3,
                        }}
                    >
                        {VALUES.map(({ Icon, title, body }, i) => (
                            <motion.div
                                key={title}
                                custom={i}
                                variants={fadeUp}
                                initial="hidden"
                                animate={valuesInView ? "visible" : "hidden"}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        bgcolor: "#242424",
                                        border: "1px solid #2E2E2E",
                                        borderRadius: "16px",
                                        p: 4,
                                        height: "100%",
                                        transition: "border-color 0.3s, transform 0.3s",
                                        "&:hover": {
                                            borderColor: "#C9A84C",
                                            transform: "translateY(-4px)",
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: "12px",
                                            bgcolor: "rgba(201,168,76,0.1)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            mb: 3,
                                        }}
                                    >
                                        <Icon sx={{ color: "#C9A84C", fontSize: "1.5rem" }} />
                                    </Box>
                                    <Typography
                                        sx={{
                                            fontFamily: "'Playfair Display', serif",
                                            fontWeight: 700,
                                            fontSize: "1.15rem",
                                            color: "#F5F0E8",
                                            mb: 1.5,
                                        }}
                                    >
                                        {title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: "#9E9E8E", lineHeight: 1.75 }}
                                    >
                                        {body}
                                    </Typography>
                                </Paper>
                            </motion.div>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* ── Anonymous manifesto ───────────────────────────────────────── */}
            <Box
                sx={{
                    py: { xs: 12, md: 18 },
                    bgcolor: "#0D0D0D",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)",
                        pointerEvents: "none",
                    }}
                />
                <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
                    <AnimatedSection delay={0}>
                        <Typography
                            variant="overline"
                            sx={{
                                color: "#C9A84C",
                                letterSpacing: "0.35em",
                                fontSize: "0.7rem",
                                display: "block",
                                mb: 4,
                            }}
                        >
                            ON ANONYMITY
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: { xs: "1.5rem", md: "2rem" },
                                fontWeight: 700,
                                color: "#F5F0E8",
                                mb: 4,
                                lineHeight: 1.4,
                            }}
                        >
                            The creator of VeritasChain is intentionally anonymous.
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: "#9E9E8E",
                                fontSize: "1.05rem",
                                lineHeight: 1.9,
                                maxWidth: 480,
                                mx: "auto",
                            }}
                        >
                            No names. No faces. No VC funding. No agenda. Just tools that work.
                            Judge the code, not the coder. The work speaks for itself  and it
                            speaks to everyone.
                        </Typography>
                    </AnimatedSection>
                </Container>
            </Box>

            {/* ── Tech strip ────────────────────────────────────────────────── */}
            <Box
                sx={{
                    py: { xs: 6, md: 8 },
                    bgcolor: "#1A1A1A",
                    borderTop: "1px solid #2E2E2E",
                    textAlign: "center",
                }}
            >
                <Container maxWidth="md">
                    <AnimatedSection delay={0}>
                        <Typography
                            variant="overline"
                            sx={{
                                color: "#9E9E8E",
                                letterSpacing: "0.3em",
                                fontSize: "0.65rem",
                                display: "block",
                                mb: 3,
                            }}
                        >
                            BUILT ON
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexWrap: "wrap",
                                gap: 0,
                                rowGap: 2,
                            }}
                        >
                            {["Ethereum", "IPFS", "Solidity", "FastAPI", "React"].map(
                                (tech, i, arr) => (
                                    <React.Fragment key={tech}>
                                        <Typography
                                            sx={{
                                                fontFamily: "'Inter', sans-serif",
                                                fontWeight: 600,
                                                fontSize: { xs: "0.9rem", md: "1rem" },
                                                color: "#C9A84C",
                                                letterSpacing: "0.05em",
                                                px: 3,
                                            }}
                                        >
                                            {tech}
                                        </Typography>
                                        {i < arr.length - 1 && (
                                            <Box
                                                component="span"
                                                sx={{
                                                    width: "1px",
                                                    height: 16,
                                                    bgcolor: "#2E2E2E",
                                                    flexShrink: 0,
                                                }}
                                            />
                                        )}
                                    </React.Fragment>
                                )
                            )}
                        </Box>
                    </AnimatedSection>
                </Container>
            </Box>

            <Footer />
        </Box>
    )
}
