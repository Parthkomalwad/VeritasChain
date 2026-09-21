import React, { useRef } from 'react';
import { Box, Button, Container, Typography, Chip } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Navbar from '../Micro-Components/Navbar';
import Footer from '../Micro-Components/Footer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';

const ChainGlyph = () => (
  <Box sx={{
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '8px', opacity: 0.05, color: '#C9A84C',
    letterSpacing: '4px', textAlign: 'center', my: 1,
    userSelect: 'text', pointerEvents: 'none',
  }}>
    .-. -
  </Box>
);

const steps = [
  {
    n: '01',
    icon: UploadFileOutlinedIcon,
    title: 'Upload Your File',
    subtitle: 'Local hashing, zero data leaks',
    desc: 'Drag and drop any media file  image, video, document, or audio. We compute its SHA-256 cryptographic fingerprint entirely in your browser. Your file never leaves your device.',
    detail: 'Supports images, videos, PDFs, code, audio, and more.',
    color: '#6EE7B7',
  },
  {
    n: '02',
    icon: AccountBalanceWalletOutlinedIcon,
    title: 'Sign with Your Wallet',
    subtitle: 'MetaMask · WalletConnect',
    desc: 'Connect your Ethereum wallet and sign the transaction. Your wallet address becomes permanently and cryptographically linked to this content  provenance you own.',
    detail: 'No gas fees beyond the transaction cost.',
    color: '#93C5FD',
  },
  {
    n: '03',
    icon: LinkOutlinedIcon,
    title: 'Anchored on Blockchain',
    subtitle: 'Ethereum · Immutable forever',
    desc: 'The SHA-256 fingerprint is written to our audited smart contract on Ethereum with a block timestamp. No one  not even us  can alter or delete it.',
    detail: 'Stored on-chain + pinned to IPFS for redundancy.',
    color: '#C9A84C',
  },
  {
    n: '04',
    icon: VerifiedOutlinedIcon,
    title: 'Share Your Proof',
    subtitle: 'One link. Instant verification.',
    desc: 'Receive a transaction ID and IPFS content hash. Share either with anyone, anywhere. They can verify authenticity instantly  no account needed.',
    detail: 'Works forever, as long as Ethereum exists.',
    color: '#F9A8D4',
  },
];

const StepCard = ({ step, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const Icon = step.icon;
  const isEven = index % 2 === 1;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? 60 : -60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: isEven ? 'row-reverse' : 'row' },
        gap: { xs: 3, md: 6 },
        alignItems: 'center',
        mb: { xs: 6, md: 10 },
      }}>
        {/* Number + icon side */}
        <motion.div
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.2 }}
          style={{ flexShrink: 0 }}
        >
          <Box sx={{
            width: { xs: 120, md: 160 },
            height: { xs: 120, md: 160 },
            borderRadius: '24px',
            background: 'linear-gradient(145deg, #242424, #1E1E1E)',
            border: `1px solid ${step.color}22`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxShadow: `0 0 40px ${step.color}12`,
            transition: 'box-shadow 0.3s',
            '&:hover': { boxShadow: `0 0 60px ${step.color}22` },
          }}>
            <Typography sx={{
              position: 'absolute',
              top: 10, right: 14,
              fontSize: '0.65rem',
              color: step.color,
              fontFamily: '"JetBrains Mono", monospace',
              opacity: 0.6,
              letterSpacing: '0.05em',
            }}>
              {step.n}
            </Typography>
            <Icon sx={{ fontSize: { xs: '2.5rem', md: '3rem' }, color: step.color, mb: 0.5, opacity: 0.9 }} />
            <Box sx={{
              width: 32, height: 2,
              background: `linear-gradient(90deg, transparent, ${step.color}, transparent)`,
              borderRadius: '2px',
              opacity: 0.5,
            }} />
          </Box>
        </motion.div>

        {/* Text side */}
        <Box sx={{ flex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Chip
                label={step.subtitle}
                size="small"
                sx={{
                  background: `${step.color}12`,
                  border: `1px solid ${step.color}30`,
                  color: step.color,
                  fontSize: '0.68rem',
                  fontFamily: '"Inter", sans-serif',
                  letterSpacing: '0.04em',
                  height: 22,
                }}
              />
            </Box>
            <Typography variant="h4" sx={{
              fontWeight: 700,
              fontSize: { xs: '1.5rem', md: '2rem' },
              mb: 1.5,
              letterSpacing: '-0.01em',
            }}>
              {step.title}
            </Typography>
            <Typography sx={{
              color: '#9E9E8E',
              lineHeight: 1.85,
              fontSize: { xs: '0.9rem', md: '1rem' },
              mb: 2,
              maxWidth: 480,
            }}>
              {step.desc}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 4, height: 4, borderRadius: '50%', background: step.color, opacity: 0.6 }} />
              <Typography sx={{ color: '#555', fontSize: '0.78rem', fontFamily: '"JetBrains Mono", monospace' }}>
                {step.detail}
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </Box>
    </motion.div>
  );
};

// Animated connecting line between steps
const StepConnector = ({ index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <Box ref={ref} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', mb: 4, mt: -4 }}>
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={inView ? { scaleY: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ transformOrigin: 'top', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
      >
        <Box sx={{ width: 1, height: 40, background: 'linear-gradient(180deg, rgba(201,168,76,0.2), rgba(201,168,76,0.05))' }} />
        <ChainGlyph />
        <Box sx={{ width: 1, height: 20, background: 'linear-gradient(180deg, rgba(201,168,76,0.05), transparent)' }} />
      </motion.div>
    </Box>
  );
};

const HowItWorksPage = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <Box sx={{ background: '#1A1A1A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <Box sx={{ flex: 1 }}>
        {/* Hero */}
        <Box ref={heroRef} sx={{
          py: { xs: 12, md: 16 },
          textAlign: 'center',
          background: 'radial-gradient(ellipse at 50% 20%, rgba(42,32,16,0.9) 0%, #1A1A1A 65%)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background glow */}
          <Box sx={{
            position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
            width: 600, height: 300,
            background: 'radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <Container maxWidth="md">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Button
                  onClick={() => navigate(-1)}
                  startIcon={<ArrowBackIcon sx={{ fontSize: '1rem' }} />}
                  sx={{ color: '#555', mb: 6, '&:hover': { color: '#C9A84C', background: 'transparent' }, fontSize: '0.8rem' }}
                >
                  Back
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                <Typography variant="overline" sx={{ color: '#C9A84C', letterSpacing: '0.35em', display: 'block', mb: 2, fontSize: '0.7rem' }}>
                  THE PROCESS
                </Typography>
                <Typography variant="h1" sx={{
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  fontWeight: 700,
                  mb: 3,
                  letterSpacing: '-0.02em',
                }}>
                  How It{' '}
                  <Box component="span" sx={{
                    background: 'linear-gradient(135deg, #C9A84C, #E8B94F)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    Works
                  </Box>
                </Typography>
                <Typography sx={{ color: '#9E9E8E', fontSize: { xs: '1rem', md: '1.15rem' }, maxWidth: 480, mx: 'auto', lineHeight: 1.8 }}>
                  Four steps. Permanent proof. No trust required  the blockchain guarantees it.
                </Typography>
              </motion.div>

              {/* Step pill indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mt: 5, flexWrap: 'wrap' }}>
                  {steps.map((s, i) => (
                    <Box key={s.n} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{
                        px: 2, py: 0.6,
                        background: `${s.color}10`,
                        border: `1px solid ${s.color}25`,
                        borderRadius: '20px',
                        display: 'flex', alignItems: 'center', gap: 0.8,
                      }}>
                        <Box sx={{ width: 5, height: 5, borderRadius: '50%', background: s.color, opacity: 0.7 }} />
                        <Typography sx={{ fontSize: '0.7rem', color: '#9E9E8E', fontFamily: '"Inter", sans-serif' }}>
                          {s.title}
                        </Typography>
                      </Box>
                      {i < steps.length - 1 && (
                        <Typography sx={{ color: '#2E2E2E', fontSize: '0.7rem' }}>→</Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </Container>
          </motion.div>
        </Box>

        {/* Steps */}
        <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
          {steps.map((step, i) => (
            <React.Fragment key={step.n}>
              <StepCard step={step} index={i} />
              {i < steps.length - 1 && <StepConnector index={i} />}
            </React.Fragment>
          ))}
        </Container>

        {/* CTA */}
        <Box sx={{
          py: { xs: 10, md: 14 },
          textAlign: 'center',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(42,32,16,0.6) 0%, #1A1A1A 65%)',
          borderTop: '1px solid #2E2E2E',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500, height: 200,
            background: 'radial-gradient(ellipse, rgba(201,168,76,0.05) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <Typography variant="overline" sx={{ color: '#C9A84C', letterSpacing: '0.35em', fontSize: '0.7rem', display: 'block', mb: 2 }}>
                GET STARTED
              </Typography>
              <Typography variant="h3" sx={{ mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' }, fontWeight: 700 }}>
                Ready to stamp your first file?
              </Typography>
              <Typography sx={{ color: '#9E9E8E', mb: 5, lineHeight: 1.8 }}>
                It takes less than 60 seconds. No account required.
              </Typography>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button
                  component={Link}
                  to="/upload"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    px: 6, py: 1.6, fontSize: '1rem', fontWeight: 600,
                    background: 'linear-gradient(135deg, #C9A84C 0%, #E8B94F 100%)',
                    color: '#1A1A1A',
                    borderRadius: '12px',
                    boxShadow: '0 0 40px rgba(201,168,76,0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #D4B05A 0%, #F0C456 100%)',
                      boxShadow: '0 0 60px rgba(201,168,76,0.45)',
                    },
                  }}
                >
                  Stamp a File
                </Button>
              </motion.div>
            </motion.div>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default HowItWorksPage;
