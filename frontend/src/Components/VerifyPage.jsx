import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, CircularProgress, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../Micro-Components/Navbar';
import Footer from '../Micro-Components/Footer';
import axios from 'axios';
import VerifiedIcon from '@mui/icons-material/Verified';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import LinkIcon from '@mui/icons-material/Link';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import HexagonOutlinedIcon from '@mui/icons-material/HexagonOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const API_URL = process.env.REACT_APP_API_BASE_URL;

const InfoRow = ({ label, value, mono, copyable }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 1.5, borderBottom: '1px solid rgba(46,46,46,0.5)' }}>
      <Typography sx={{ fontSize: '0.75rem', color: '#555', fontFamily: '"Inter", sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', pt: 0.3, flexShrink: 0, mr: 2 }}>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, justifyContent: 'flex-end' }}>
        <Typography sx={{
          fontSize: '0.78rem',
          color: '#C9A84C',
          fontFamily: mono ? '"JetBrains Mono", monospace' : '"Inter", sans-serif',
          wordBreak: 'break-all',
          textAlign: 'right',
        }}>
          {value}
        </Typography>
        {copyable && (
          <Box component="button" onClick={handleCopy} sx={{
            background: 'none', border: 'none', cursor: 'pointer', p: 0.3,
            color: copied ? '#4ADE80' : '#555',
            transition: 'color 0.2s', flexShrink: 0,
            '&:hover': { color: '#C9A84C' },
          }}>
            {copied ? <CheckIcon sx={{ fontSize: '0.85rem' }} /> : <ContentCopyIcon sx={{ fontSize: '0.85rem' }} />}
          </Box>
        )}
      </Box>
    </Box>
  );
};

const VerifyPage = () => {
  const [hash, setHash] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!hash.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await axios.get(`${API_URL}/api/v1/files/verify`, {
        params: { file_hash: hash.trim() },
      });
      setResult({ verified: true, data: response.data });
    } catch (err) {
      if (err.response?.status === 404) {
        setResult({ verified: false });
      } else {
        setError('Verification failed. Check the hash and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ background: '#1A1A1A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Hero */}
      <Box sx={{
        py: { xs: 10, md: 14 },
        background: 'radial-gradient(ellipse at 50% 0%, rgba(42,32,16,0.8) 0%, #1A1A1A 60%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Box sx={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 250,
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Chip label="On-Chain Verification" size="small" sx={{
              mb: 3, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)',
              color: '#C9A84C', fontSize: '0.7rem', letterSpacing: '0.05em',
            }} />
            <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, fontWeight: 700, mb: 2, letterSpacing: '-0.02em' }}>
              Verify{' '}
              <Box component="span" sx={{ background: 'linear-gradient(135deg, #C9A84C, #E8B94F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Authenticity
              </Box>
            </Typography>
            <Typography sx={{ color: '#9E9E8E', fontSize: '1.05rem', maxWidth: 480, mx: 'auto', lineHeight: 1.8 }}>
              Paste an IPFS hash to instantly check if a file is anchored on the Ethereum blockchain.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Main */}
      <Container maxWidth="sm" sx={{ flex: 1, py: { xs: 6, md: 8 }, pb: 14 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>

          {/* Input card */}
          <Box sx={{
            p: { xs: 3, md: 4 },
            background: '#242424',
            border: '1px solid #2E2E2E',
            borderRadius: '20px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
            mb: 3,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <SearchIcon sx={{ color: '#C9A84C', fontSize: '1.1rem' }} />
              <Typography sx={{ fontSize: '0.8rem', color: '#9E9E8E', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: '"Inter", sans-serif' }}>
                Enter IPFS Hash
              </Typography>
            </Box>

            <TextField
              fullWidth
              placeholder="Qm... or bafy..."
              value={hash}
              onChange={e => { setHash(e.target.value); setResult(null); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleVerify()}
              multiline={false}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  color: '#F5F0E8',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.85rem',
                  borderRadius: '12px',
                  background: 'rgba(26,26,26,0.6)',
                  '& fieldset': { borderColor: '#333' },
                  '&:hover fieldset': { borderColor: 'rgba(201,168,76,0.4)' },
                  '&.Mui-focused fieldset': { borderColor: '#C9A84C' },
                },
                '& .MuiInputLabel-root': { color: '#555', fontSize: '0.82rem' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#C9A84C' },
              }}
              label="IPFS Hash"
            />

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleVerify}
                disabled={loading || !hash.trim()}
                endIcon={!loading && <SearchIcon />}
                sx={{
                  py: 1.6, fontSize: '0.95rem', fontWeight: 600,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #C9A84C 0%, #E8B94F 100%)',
                  color: '#1A1A1A',
                  boxShadow: '0 0 30px rgba(201,168,76,0.2)',
                  '&:hover': { background: 'linear-gradient(135deg, #D4B05A, #F0C456)', boxShadow: '0 0 40px rgba(201,168,76,0.35)' },
                  '&:disabled': { background: '#2E2E2E', color: '#444', boxShadow: 'none' },
                }}
              >
                {loading ? <CircularProgress size={22} sx={{ color: '#C9A84C' }} /> : 'Verify Now'}
              </Button>
            </motion.div>
          </Box>

          {/* Example hint */}
          {!result && !loading && (
            <Typography sx={{ textAlign: 'center', fontSize: '0.72rem', color: '#333', fontFamily: '"JetBrains Mono", monospace' }}>
              Example: QmX7bVbBn4EuRDk2EhBRG3...
            </Typography>
          )}

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Box sx={{ mt: 3, p: 3, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '14px', display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <ErrorOutlineIcon sx={{ color: '#ef4444', fontSize: '1.2rem', flexShrink: 0 }} />
                  <Typography sx={{ color: '#ef4444', fontSize: '0.85rem' }}>{error}</Typography>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {result.verified ? (
                  <Box sx={{
                    mt: 3, p: { xs: 3, md: 4 },
                    background: 'linear-gradient(145deg, rgba(74,222,128,0.04), rgba(74,222,128,0.02))',
                    border: '1px solid rgba(74,222,128,0.25)',
                    borderRadius: '20px',
                    boxShadow: '0 0 40px rgba(74,222,128,0.05)',
                  }}>
                    {/* Verified header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, pb: 3, borderBottom: '1px solid rgba(46,46,46,0.5)' }}>
                      <Box sx={{
                        width: 40, height: 40, borderRadius: '10px',
                        background: 'rgba(74,222,128,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid rgba(74,222,128,0.2)',
                      }}>
                        <VerifiedIcon sx={{ color: '#4ADE80', fontSize: '1.3rem' }} />
                      </Box>
                      <Box>
                        <Typography sx={{ color: '#4ADE80', fontWeight: 700, fontSize: '1rem' }}>
                          Verified on Blockchain
                        </Typography>
                        <Typography sx={{ color: '#555', fontSize: '0.72rem', fontFamily: '"JetBrains Mono", monospace' }}>
                          Ethereum · Immutable Record
                        </Typography>
                      </Box>
                      <Box sx={{ ml: 'auto' }}>
                        <Chip label="AUTHENTIC" size="small" sx={{
                          background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)',
                          color: '#4ADE80', fontSize: '0.62rem', letterSpacing: '0.1em', fontWeight: 700,
                        }} />
                      </Box>
                    </Box>

                    {/* Data rows */}
                    {result.data && Object.entries(result.data).map(([k, v]) => (
                      <InfoRow key={k} label={k.replace(/_/g, ' ')} value={String(v)} mono copyable={k.includes('hash') || k.includes('tx')} />
                    ))}

                    <Box sx={{ mt: 3, pt: 2, display: 'flex', gap: 1.5 }}>
                      <Button
                        size="small"
                        startIcon={<LinkIcon sx={{ fontSize: '0.9rem' }} />}
                        sx={{ color: '#C9A84C', fontSize: '0.75rem', borderColor: 'rgba(201,168,76,0.25)', border: '1px solid', borderRadius: '8px', px: 2 }}
                        onClick={() => result.data?.ipfs_hash && window.open(`https://ipfs.io/ipfs/${result.data.ipfs_hash}`, '_blank')}
                      >
                        View on IPFS
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{
                    mt: 3, p: { xs: 3, md: 4 },
                    background: 'rgba(239,68,68,0.04)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: '20px',
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{
                        width: 40, height: 40, borderRadius: '10px',
                        background: 'rgba(239,68,68,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid rgba(239,68,68,0.15)',
                      }}>
                        <ErrorOutlineIcon sx={{ color: '#ef4444', fontSize: '1.3rem' }} />
                      </Box>
                      <Box>
                        <Typography sx={{ color: '#ef4444', fontWeight: 700, fontSize: '1rem' }}>Not Found on Blockchain</Typography>
                        <Typography sx={{ color: '#555', fontSize: '0.78rem', mt: 0.3 }}>
                          This hash has no on-chain record. It may be unregistered or the hash is incorrect.
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* How it works mini strip */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
          <Box sx={{ mt: 8, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
            {[
              { Icon: ManageSearchIcon, title: 'Paste Hash', desc: 'Enter the IPFS CID from your stamp certificate' },
              { Icon: HexagonOutlinedIcon, title: 'Chain Lookup', desc: 'We query the Ethereum smart contract directly' },
              { Icon: TaskAltIcon, title: 'Instant Result', desc: 'Get verified proof or a clear not-found result' },
            ].map(s => (
              <Box key={s.title} sx={{ p: 2.5, background: '#1E1E1E', border: '1px solid #272727', borderRadius: '14px', textAlign: 'center' }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                  <s.Icon sx={{ color: '#C9A84C', fontSize: '1.1rem' }} />
                </Box>
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, mb: 0.5 }}>{s.title}</Typography>
                <Typography sx={{ fontSize: '0.7rem', color: '#555', lineHeight: 1.6 }}>{s.desc}</Typography>
              </Box>
            ))}
          </Box>
        </motion.div>
      </Container>

      <Footer />
    </Box>
  );
};

export default VerifyPage;
