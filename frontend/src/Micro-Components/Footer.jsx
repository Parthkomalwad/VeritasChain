import React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const FooterGlyph = () => (
  <Box sx={{
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '8px', opacity: 0.06, color: '#C9A84C',
    letterSpacing: '4px', userSelect: 'text', pointerEvents: 'none',
    textAlign: 'center', mt: 2,
  }}>
    -- .- .-.. .-- .- -..
  </Box>
);

const Footer = () => {
  const navigate = useNavigate();
  const routes = { 'How It Works': '/how-it-works', 'Stamp a File': '/upload', 'Verify': '/verify', 'About': '/about', 'API Docs': '/docs' };
  return (
  <Box sx={{ background: '#111111', borderTop: '1px solid #2E2E2E', py: 6 }}>
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4, mb: 4 }}>
        <Box>
          <Box sx={{ mb: 1.5 }}>
            <Logo size={24} textSize="1.15rem" noLink />
          </Box>
          <Typography variant="body2" sx={{ color: '#9E9E8E', maxWidth: '280px' }}>
            Authenticate reality. Preserve truth. Decentralized media integrity for a world of deepfakes.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 6 }}>
          <Box>
            <Typography variant="overline" sx={{ color: '#C9A84C', letterSpacing: '0.2em', display: 'block', mb: 2 }}>Product</Typography>
            {['How It Works', 'Stamp a File', 'Verify', 'About', 'API Docs'].map(l => (
              <Typography key={l} variant="body2" onClick={() => navigate(routes[l])} sx={{ color: '#9E9E8E', mb: 1, cursor: 'pointer', '&:hover': { color: '#F5F0E8' } }}>{l}</Typography>
            ))}
          </Box>
        </Box>
      </Box>
      <Divider sx={{ borderColor: '#2E2E2E', mb: 3 }} />
      <Typography variant="body2" sx={{ color: '#9E9E8E', textAlign: 'center' }}>
        © 2026 VeritasChain. Open source. Built on Ethereum + IPFS.
      </Typography>
      <FooterGlyph />
    </Container>
  </Box>
  );
};

export default Footer;
