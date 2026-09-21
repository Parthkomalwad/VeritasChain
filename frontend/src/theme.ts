import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#1A1A1A',
      paper: '#242424',
    },
    primary: {
      main: '#C9A84C',
      light: '#E8B94F',
      dark: '#A07830',
    },
    secondary: {
      main: '#E8B94F',
    },
    text: {
      primary: '#F5F0E8',
      secondary: '#9E9E8E',
    },
    success: {
      main: '#4CAF7D',
    },
    divider: '#2E2E2E',
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    h2: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    h3: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
    h4: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
    h5: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
    h6: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: 'linear-gradient(135deg, #C9A84C, #E8B94F)',
          color: '#1A1A1A',
          fontWeight: 600,
          '&:hover': {
            background: 'linear-gradient(135deg, #E8B94F, #C9A84C)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#242424',
          border: '1px solid #2E2E2E',
        },
      },
    },
  },
});

export default theme;
