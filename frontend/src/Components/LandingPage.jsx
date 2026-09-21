import { useRef } from 'react';
import { Box, Container, Typography } from "@mui/material";
import { motion, useInView } from 'framer-motion';
import Navbar from "../Micro-Components/Navbar";
import FeatureCard from "../Micro-Components/FeatureCard";
import HeroSection from "../Micro-Components/HeroSection";
import Footer from "../Micro-Components/Footer";
import FingerprintOutlinedIcon from '@mui/icons-material/FingerprintOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';

const features = [
    {
        Icon: FingerprintOutlinedIcon,
        title: "Stamp",
        description: "Upload any media file. We anchor its cryptographic fingerprint on the Ethereum blockchain permanently.",
    },
    {
        Icon: VerifiedOutlinedIcon,
        title: "Verify",
        description: "Instantly check if any file matches a blockchain record. Proof of authenticity in seconds.",
    },
    {
        Icon: HistoryEduOutlinedIcon,
        title: "Prove",
        description: "Know who uploaded what, and when. Immutable chain of custody for journalists, creators, and researchers.",
    },
];

const useCases = [
    { Icon: NewspaperOutlinedIcon, label: "Journalists", desc: "Certify source documents and photos before publication." },
    { Icon: BrushOutlinedIcon, label: "Creators", desc: "Timestamp your work. Prove you made it first." },
    { Icon: GavelOutlinedIcon, label: "Legal Teams", desc: "Admissible digital evidence with blockchain provenance." },
    { Icon: ScienceOutlinedIcon, label: "Researchers", desc: "Immutable audit trail for datasets and findings." },
    { Icon: RecordVoiceOverOutlinedIcon, label: "Whistleblowers", desc: "Leak documents with verifiable, tamper-proof integrity." },
    { Icon: AccountBalanceOutlinedIcon, label: "Archivists", desc: "Preserve digital heritage with cryptographic certainty." },
];

const steps = [
    { step: '01', title: 'Upload Your File', desc: 'Drag & drop any media  image, video, document, or audio. Your file is hashed locally before anything leaves your device.' },
    { step: '02', title: 'Anchor on Blockchain', desc: 'The SHA-256 fingerprint is stored on the Ethereum blockchain via a smart contract. Immutable. Timestamped. Forever.' },
    { step: '03', title: 'Get Your Proof', desc: 'Receive a cryptographic certificate with your IPFS hash and transaction ID. Share it with anyone to prove authenticity.' },
];

const SectionReveal = ({ children, delay = 0 }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            {children}
        </motion.div>
    );
};

const Divider = () => (
    <Box sx={{
        width: '40%', height: '1px', mx: 'auto',
        background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.25), transparent)',
    }} />
);

export default function Home() {
    const featuresRef = useRef(null);
    const featuresInView = useInView(featuresRef, { once: true, margin: '-80px' });

    const stepsRef = useRef(null);
    const stepsInView = useInView(stepsRef, { once: true, margin: '-80px' });

    const useCasesRef = useRef(null);
    const useCasesInView = useInView(useCasesRef, { once: true, margin: '-80px' });

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#1A1A1A", display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <HeroSection />

            {/* What We Do */}
            <Box sx={{ py: { xs: 10, md: 14 } }}>
                <Divider />
                <Container maxWidth="lg" sx={{ pt: 10 }}>
                    <SectionReveal>
                        <Box sx={{ textAlign: 'center', mb: 7 }}>
                            <Typography variant="overline" sx={{ color: '#C9A84C', letterSpacing: '0.35em', fontSize: '0.7rem' }}>
                                WHAT WE DO
                            </Typography>
                            <Typography variant="h2" sx={{ mt: 1.5, fontSize: { xs: '1.9rem', md: '2.8rem' }, fontWeight: 700 }}>
                                Authenticate. Verify. Prove.
                            </Typography>
                            <Typography sx={{ color: '#9E9E8E', mt: 2, maxWidth: 480, mx: 'auto', lineHeight: 1.8, fontSize: '0.95rem' }}>
                                Three pillars of media integrity. One decentralized platform.
                            </Typography>
                        </Box>
                    </SectionReveal>

                    <Box ref={featuresRef}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                            {features.map((feature, i) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.6, delay: i * 0.15 }}
                                    style={{ display: 'flex' }}
                                >
                                    <FeatureCard Icon={feature.Icon} title={feature.title} description={feature.description} />
                                </motion.div>
                            ))}
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* How It Works */}
            <Box sx={{ py: { xs: 10, md: 14 }, background: '#1C1C1C' }}>
                <Divider />
                <Container maxWidth="lg" sx={{ pt: 10 }}>
                    <SectionReveal>
                        <Box sx={{ textAlign: 'center', mb: 7 }}>
                            <Typography variant="overline" sx={{ color: '#C9A84C', letterSpacing: '0.35em', fontSize: '0.7rem' }}>
                                HOW IT WORKS
                            </Typography>
                            <Typography variant="h2" sx={{ mt: 1.5, fontSize: { xs: '1.9rem', md: '2.8rem' }, fontWeight: 700 }}>
                                Three Steps to Immutable Proof
                            </Typography>
                        </Box>
                    </SectionReveal>

                    <Box ref={stepsRef} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                        {steps.map((s, i) => (
                            <motion.div
                                key={s.step}
                                initial={{ opacity: 0, y: 40 }}
                                animate={stepsInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: i * 0.14 }}
                            >
                                <Box sx={{
                                    p: { xs: 3, md: 4 },
                                    background: '#242424',
                                    border: '1px solid #2E2E2E',
                                    borderRadius: '16px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    height: '100%',
                                    transition: 'border-color 0.3s, transform 0.3s',
                                    '&:hover': { borderColor: 'rgba(201,168,76,0.3)', transform: 'translateY(-4px)' },
                                }}>
                                    <Typography sx={{
                                        fontSize: '4.5rem', fontWeight: 800, lineHeight: 1,
                                        color: 'rgba(201,168,76,0.06)',
                                        fontFamily: '"Playfair Display", serif',
                                        position: 'absolute', top: 8, right: 16,
                                        userSelect: 'none',
                                    }}>
                                        {s.step}
                                    </Typography>
                                    <Box sx={{ width: 36, height: 3, background: 'linear-gradient(90deg, #C9A84C, #E8B94F)', borderRadius: '2px', mb: 3 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, fontSize: '1rem' }}>{s.title}</Typography>
                                    <Typography sx={{ color: '#9E9E8E', lineHeight: 1.8, fontSize: '0.85rem' }}>{s.desc}</Typography>
                                </Box>
                            </motion.div>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* Built For */}
            <Box sx={{ py: { xs: 10, md: 14 } }}>
                <Divider />
                <Container maxWidth="lg" sx={{ pt: 10 }}>
                    <SectionReveal>
                        <Box sx={{ textAlign: 'center', mb: 7 }}>
                            <Typography variant="overline" sx={{ color: '#C9A84C', letterSpacing: '0.35em', fontSize: '0.7rem' }}>
                                BUILT FOR
                            </Typography>
                            <Typography variant="h2" sx={{ mt: 1.5, fontSize: { xs: '1.9rem', md: '2.8rem' }, fontWeight: 700 }}>
                                Who Uses VeritasChain?
                            </Typography>
                        </Box>
                    </SectionReveal>

                    <Box ref={useCasesRef} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2.5 }}>
                        {useCases.map((u, i) => (
                            <motion.div
                                key={u.label}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={useCasesInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                            >
                                <Box sx={{
                                    p: 3,
                                    background: '#242424',
                                    border: '1px solid #2E2E2E',
                                    borderRadius: '14px',
                                    display: 'flex', gap: 2, alignItems: 'flex-start',
                                    transition: 'border-color 0.3s, transform 0.3s',
                                    '&:hover': { borderColor: 'rgba(201,168,76,0.25)', transform: 'translateY(-3px)' },
                                }}>
                                    <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <u.Icon sx={{ color: '#C9A84C', fontSize: '1.1rem' }} />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontWeight: 600, mb: 0.4, fontSize: '0.9rem' }}>{u.label}</Typography>
                                        <Typography sx={{ color: '#9E9E8E', fontSize: '0.78rem', lineHeight: 1.7 }}>{u.desc}</Typography>
                                    </Box>
                                </Box>
                            </motion.div>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* Trust strip */}
            <SectionReveal>
                <Box sx={{ py: 2.5, borderTop: '1px solid #2E2E2E', borderBottom: '1px solid #2E2E2E' }}>
                    <Container maxWidth="lg">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 3, md: 7 }, flexWrap: 'wrap' }}>
                            {[
                                { icon: '⬡', label: 'SECURED BY ETHEREUM' },
                                { icon: '⬡', label: 'STORED ON IPFS' },
                                { icon: '⬡', label: 'OPEN SOURCE' },
                                { icon: '⬡', label: 'NO DATA COLLECTED' },
                            ].map(t => (
                                <Box key={t.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                    <Typography sx={{ color: 'rgba(201,168,76,0.35)', fontSize: '0.8rem' }}>{t.icon}</Typography>
                                    <Typography sx={{ color: '#484848', fontSize: '0.65rem', letterSpacing: '0.18em', fontWeight: 500 }}>
                                        {t.label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Container>
                </Box>
            </SectionReveal>

            <Box sx={{ flex: 1 }} />
            <Footer />
        </Box>
    );
}
