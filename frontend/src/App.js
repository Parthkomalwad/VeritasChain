import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import BlockchainFileUploader from "./Components/BlockchainFileUploader";
import TransactionList from "./Components/TransactionList";
import LandingPage from "./Components/LandingPage";
import DocsPage from "./Components/DocsPage";
import APIKeyPage from "./Components/APIKeyPage";
import HowItWorksPage from "./Components/HowItWorksPage";
import VerifyPage from "./Components/VerifyPage";
import AboutPage from "./Components/AboutPage";
import ScrollToTop from "./Micro-Components/ScrollToTop";

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/home" element={<LandingPage />} />
                    <Route path="/upload" element={<BlockchainFileUploader />} />
                    <Route path="/public-transactions/:walletAddress?" element={<TransactionList />} />
                    <Route path="/transactions/:walletAddress?" element={<TransactionList />} />
                    <Route path="/transactions" element={<TransactionList />} />
                    <Route path="/docs" element={<DocsPage />} />
                    <Route path="/api-keys" element={<APIKeyPage />} />
                    <Route path="/how-it-works" element={<HowItWorksPage />} />
                    <Route path="/verify" element={<VerifyPage />} />
                    <Route path="/about" element={<AboutPage />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;