import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion, useInView } from 'framer-motion';

const useCountUp = (target, duration = 2000, inView) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
};

const StatItem = ({ value, suffix, label }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useCountUp(value, 2000, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <Box sx={{ textAlign: 'center', px: 4 }}>
        <Typography variant="h3" sx={{
          fontFamily: '"Playfair Display", serif',
          background: 'linear-gradient(135deg, #C9A84C, #E8B94F)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          fontWeight: 700, mb: 0.5,
        }}>
          {count.toLocaleString()}{suffix}
        </Typography>
        <Typography variant="body2" sx={{ color: '#9E9E8E', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
          {label}
        </Typography>
      </Box>
    </motion.div>
  );
};

const stats = [
  { value: 12847, suffix: '+', label: 'Files Stamped' },
  { value: 99, suffix: '.9%', label: 'Uptime' },
  { value: 3, suffix: '', label: 'Chains Supported' },
  { value: 4200, suffix: '+', label: 'Verified Proofs' },
];

const StatsSection = () => (
  <Box sx={{ py: 8, borderTop: '1px solid #2E2E2E', borderBottom: '1px solid #2E2E2E' }}>
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 4 }}>
        {stats.map(s => <StatItem key={s.label} {...s} />)}
      </Box>
    </Container>
  </Box>
);

export default StatsSection;
