import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from './Logo';

const navLinks = [
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Verify', to: '/verify' },
  { label: 'Docs', to: '/docs' },
  { label: 'API Keys', to: '/api-keys' },
  { label: 'About', to: '/about' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{
        background: scrolled
          ? 'rgba(20,20,20,0.95)'
          : 'rgba(26,26,26,0.75)',
        backdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid rgba(201,168,76,0.15)' : '1px solid rgba(46,46,46,0.6)',
        transition: 'all 0.3s ease',
      }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 6 }, minHeight: '68px !important' }}>

          {/* Logo */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Logo size={26} textSize="1.2rem" />
          </motion.div>

          {/* Desktop Nav */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, alignItems: 'center' }}>
            {navLinks.map(({ label, to }) => {
              const active = location.pathname === to;
              return (
                <Button
                  key={to}
                  component={Link}
                  to={to}
                  sx={{
                    color: active ? '#C9A84C' : '#9E9E8E',
                    fontWeight: active ? 600 : 400,
                    fontSize: '0.875rem',
                    letterSpacing: '0.03em',
                    px: 2,
                    py: 1,
                    borderRadius: '8px',
                    position: 'relative',
                    transition: 'all 0.2s',
                    '&:hover': { color: '#F5F0E8', background: 'rgba(201,168,76,0.07)' },
                    '&::after': active ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 6,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '20px',
                      height: '2px',
                      background: 'linear-gradient(90deg, #C9A84C, #E8B94F)',
                      borderRadius: '2px',
                    } : {},
                  }}
                >
                  {label}
                </Button>
              );
            })}

            <Box sx={{ width: '1px', height: 24, background: '#2E2E2E', mx: 1 }} />

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                component={Link}
                to="/upload"
                variant="contained"
                sx={{
                  borderRadius: '10px',
                  px: 3,
                  py: 1,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  background: 'linear-gradient(135deg, #C9A84C 0%, #E8B94F 100%)',
                  color: '#1A1A1A',
                  boxShadow: '0 0 20px rgba(201,168,76,0.25)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #D4B05A 0%, #F0C456 100%)',
                    boxShadow: '0 0 28px rgba(201,168,76,0.4)',
                  },
                }}
              >
                Stamp a File
              </Button>
            </motion.div>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            sx={{ display: { xs: 'flex', md: 'none' }, color: '#9E9E8E' }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { background: '#1A1A1A', width: 260, borderLeft: '1px solid #2E2E2E' } }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Logo size={24} textSize="1.1rem" />
          </Box>
          <Divider sx={{ borderColor: '#2E2E2E', mb: 2 }} />
          <List disablePadding>
            {navLinks.map(({ label, to }) => (
              <ListItem key={to} disablePadding>
                <ListItemButton
                  component={Link}
                  to={to}
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    borderRadius: '8px',
                    mb: 0.5,
                    color: location.pathname === to ? '#C9A84C' : '#9E9E8E',
                    '&:hover': { color: '#F5F0E8', background: 'rgba(201,168,76,0.07)' },
                  }}
                >
                  <ListItemText primary={label} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ mt: 3 }}>
            <Button
              component={Link}
              to="/upload"
              fullWidth
              variant="contained"
              onClick={() => setDrawerOpen(false)}
              sx={{
                borderRadius: '10px',
                py: 1.2,
                background: 'linear-gradient(135deg, #C9A84C 0%, #E8B94F 100%)',
                color: '#1A1A1A',
                fontWeight: 600,
              }}
            >
              Stamp a File
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
