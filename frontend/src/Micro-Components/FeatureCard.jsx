import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const FeatureCard = ({ Icon, icon, title, description }) => (
  <motion.div whileHover={{ y: -8, transition: { duration: 0.22 } }} style={{ height: '100%' }}>
    <Box sx={{
      height: '100%',
      p: 4,
      background: 'linear-gradient(145deg, #262626 0%, #222222 100%)',
      border: '1px solid #2E2E2E',
      borderRadius: '18px',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'default',
      transition: 'border-color 0.3s, box-shadow 0.3s',
      '&:hover': {
        borderColor: 'rgba(201,168,76,0.35)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 40px rgba(201,168,76,0.05)',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)',
        opacity: 0,
        transition: 'opacity 0.3s',
      },
      '&:hover::before': { opacity: 1 },
    }}>
      <Box sx={{
        width: 52, height: 52, borderRadius: '14px',
        background: 'rgba(201,168,76,0.08)',
        border: '1px solid rgba(201,168,76,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        mb: 3,
      }}>
        {Icon
          ? <Icon sx={{ color: '#C9A84C', fontSize: '1.6rem' }} />
          : <Box sx={{ fontSize: '1.5rem' }}>{icon}</Box>
        }
      </Box>
      <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 700, fontSize: '1.2rem', letterSpacing: '0.01em' }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: '#9E9E8E', lineHeight: 1.85, fontSize: '0.875rem' }}>
        {description}
      </Typography>
      <Box sx={{
        position: 'absolute', bottom: 0, left: 0,
        width: '100%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent)',
      }} />
    </Box>
  </motion.div>
);

export default FeatureCard;
