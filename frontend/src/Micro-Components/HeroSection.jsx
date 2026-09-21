import React, { useEffect, useRef } from 'react';
import { Box, Typography, Button, Container, Chip } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import { Link } from 'react-router-dom';
import ParticleNetwork from './ParticleNetwork';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const GridNoise = () => (
  <Box sx={{
    position: 'absolute', bottom: 24, right: 32,
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '8px', opacity: 0.06, color: '#C9A84C',
    letterSpacing: '4px', userSelect: 'text', pointerEvents: 'none',
  }}>
    .--. .-
  </Box>
);

const floatVariants = {
  animate: {
    y: [0, -12, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
};

const HeroSection = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start('visible');
  }, [controls]);

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <Box sx={{
      position: 'relative',
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 55% 35%, rgba(42,32,16,0.9) 0%, #1A1A1A 55%), radial-gradient(ellipse at 10% 80%, rgba(201,168,76,0.04) 0%, transparent 50%)',
      display: 'flex', alignItems: 'center',
      overflow: 'hidden',
    }}>
      <ParticleNetwork />

      {/* Glow orb */}
      <Box sx={{
        position: 'absolute', top: '20%', right: '12%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', bottom: '15%', left: '5%',
        width: 250, height: 250,
        background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 10, md: 0 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, md: 8 } }}>

          {/* Left content */}
          <Box sx={{ flex: 1, maxWidth: '640px' }}>
            <motion.div variants={container} initial="hidden" animate={controls}>

              <motion.div variants={item}>
                <Chip
                  label="⬡ Open Source · Built on Ethereum"
                  size="small"
                  sx={{
                    mb: 3,
                    background: 'rgba(201,168,76,0.1)',
                    border: '1px solid rgba(201,168,76,0.25)',
                    color: '#C9A84C',
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.72rem',
                    letterSpacing: '0.05em',
                    '& .MuiChip-label': { px: 1.5 },
                  }}
                />
              </motion.div>

              <motion.div variants={item}>
                <Typography
                  variant="overline"
                  sx={{ color: '#C9A84C', letterSpacing: '0.35em', mb: 2, display: 'block', fontSize: '0.7rem' }}
                >
                  MEDIA INTEGRITY PLATFORM
                </Typography>
              </motion.div>

              <motion.div variants={item}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.6rem', sm: '3.4rem', md: '4.8rem' },
                    lineHeight: 1.08,
                    mb: 3,
                    fontWeight: 700,
                  }}
                >
                  Authenticate
                  <br />Reality.{' '}
                  <Box
                    component="span"
                    sx={{
                      background: 'linear-gradient(135deg, #C9A84C 20%, #E8B94F 60%, #F5D68A 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Preserve
                    <br />Truth.
                  </Box>
                </Typography>
              </motion.div>

              <motion.div variants={item}>
                <Typography
                  variant="body1"
                  sx={{ color: '#9E9E8E', fontSize: { xs: '1rem', md: '1.15rem' }, maxWidth: '500px', mb: 5, lineHeight: 1.85 }}
                >
                  Stamp your media on the blockchain. Prove authenticity instantly.
                  Fight deepfakes and misinformation with immutable, decentralized proof.
                </Typography>
              </motion.div>

              <motion.div variants={item}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      component={Link}
                      to="/upload"
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        px: 4, py: 1.5, fontSize: '0.95rem', fontWeight: 600,
                        background: 'linear-gradient(135deg, #C9A84C 0%, #E8B94F 100%)',
                        color: '#1A1A1A',
                        boxShadow: '0 0 30px rgba(201,168,76,0.3)',
                        borderRadius: '12px',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #D4B05A 0%, #F0C456 100%)',
                          boxShadow: '0 0 40px rgba(201,168,76,0.45)',
                        },
                      }}
                    >
                      Stamp a File
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      component={Link}
                      to="/how-it-works"
                      variant="outlined"
                      size="large"
                      startIcon={<PlayArrowIcon sx={{ fontSize: '1rem' }} />}
                      sx={{
                        px: 4, py: 1.5, fontSize: '0.95rem',
                        borderColor: 'rgba(201,168,76,0.3)',
                        color: '#C9A84C',
                        borderRadius: '12px',
                        '&:hover': {
                          borderColor: '#C9A84C',
                          background: 'rgba(201,168,76,0.06)',
                          color: '#E8B94F',
                        },
                      }}
                    >
                      See How It Works
                    </Button>
                  </motion.div>
                </Box>
              </motion.div>


            </motion.div>
          </Box>

          {/* Right  floating card mockup */}
          <Box sx={{ display: { xs: 'none', lg: 'flex' }, flex: '0 0 360px', justifyContent: 'center' }}>
            <motion.div variants={floatVariants} animate="animate">
              <Box sx={{
                background: 'rgba(36,36,36,0.8)',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: '20px',
                backdropFilter: 'blur(12px)',
                p: 4,
                width: 320,
                boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 60px rgba(201,168,76,0.06)',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 8px #4ADE80' }} />
                  <Typography sx={{ fontSize: '0.75rem', color: '#9E9E8E', fontFamily: '"JetBrains Mono", monospace' }}>
                    stamp_verified.json
                  </Typography>
                </Box>
                {[
                  { k: 'hash', v: '0x8f3a...c91d', gold: true },
                  { k: 'chain', v: 'Ethereum' },
                  { k: 'block', v: '#19,482,331' },
                  { k: 'timestamp', v: '2026-03-15' },
                  { k: 'status', v: 'VERIFIED ✓', gold: true },
                ].map(row => (
                  <Box key={row.k} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.72rem', color: '#555', fontFamily: '"JetBrains Mono", monospace' }}>
                      {row.k}
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: row.gold ? '#C9A84C' : '#9E9E8E', fontFamily: '"JetBrains Mono", monospace', fontWeight: row.gold ? 600 : 400 }}>
                      {row.v}
                    </Typography>
                  </Box>
                ))}
                <Box sx={{ mt: 3, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)' }} />
                <Box sx={{ mt: 2.5, p: 1.5, background: 'rgba(201,168,76,0.05)', borderRadius: '8px', border: '1px solid rgba(201,168,76,0.1)' }}>
                  <Typography sx={{ fontSize: '0.68rem', color: '#C9A84C', fontFamily: '"JetBrains Mono", monospace', textAlign: 'center', letterSpacing: '0.1em' }}>
                    ANCHORED ON-CHAIN · IMMUTABLE
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Box>

        </Box>
      </Container>

      <GridNoise />
    </Box>
  );
};

export default HeroSection;
