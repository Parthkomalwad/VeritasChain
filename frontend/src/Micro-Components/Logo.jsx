import React from 'react';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';

// VeritasChain logo image
const Logo = ({ size = 28, linkTo = '/home', noLink = false }) => {
    const inner = (
        <Box sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', cursor: 'pointer' }}>
            <Box
                component="img"
                src="/VeritasChain.png"
                alt="VeritasChain"
                sx={{ height: size * 1.4, maxHeight: 48, objectFit: 'contain' }}
            />
        </Box>
    );

    if (noLink) return inner;

    return (
        <Box component={Link} to={linkTo} sx={{ textDecoration: 'none' }}>
            {inner}
        </Box>
    );
};

export { Logo as HexLogo };
export default Logo;
